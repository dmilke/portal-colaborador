'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/src/shared/lib/permissions'
import { createConfiguracaoRepository } from '../repositories/configuracao-repository'
import { createConfiguracaoService } from '../services/configuracao-service'
import { createAdminClient } from '@/lib/supabase/admin'

export type ConfiguracaoActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | null

export async function updateConfiguracaoAction(
  prevState: ConfiguracaoActionState,
  formData: FormData,
): Promise<ConfiguracaoActionState> {
  const perm = await checkPermission('configuracao.editar')
  if (!perm.allowed) return { message: perm.error }

  const chave = formData.get('chave') as string
  const valor = formData.get('valor') as string

  if (!chave) return { message: 'Chave nao informada' }
  if (!valor || valor.trim() === '') return { message: 'Valor nao pode ser vazio' }

  const supabase = await createClient()
  const repository = createConfiguracaoRepository(supabase)
  const service = createConfiguracaoService(repository)

  try {
    await service.update(chave, { valor }, perm.colaboradorId!)

    const admin = await createAdminClient()
    await admin.from('auditoria').insert({
      colaborador_id: perm.colaboradorId,
      acao: 'alteracao_configuracoes',
      entidade_tipo: 'configuracao',
      entidade_id: null,
      descricao: `Configuracao "${chave}" alterada para "${valor}"`,
    })

    revalidatePath('/configuracoes')
    return { success: true, message: 'Configuracao atualizada com sucesso' }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao atualizar configuracao' }
  }
}
