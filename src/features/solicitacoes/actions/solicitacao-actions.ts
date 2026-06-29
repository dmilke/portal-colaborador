'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkPermission } from '@/src/shared/lib/permissions'
import { createSolicitacaoRepository } from '../repositories/solicitacao-repository'
import { createSolicitacaoService } from '../services/solicitacao-service'
import { solicitacaoSchema, solicitacaoApproveSchema, solicitacaoRejectSchema, solicitacaoCancelSchema } from '../schemas/solicitacao-schema'
import type { SolicitacaoActionState } from '../types'

export type { SolicitacaoActionState } from '../types'

export async function createSolicitacaoAction(
  prevState: SolicitacaoActionState,
  formData: FormData,
): Promise<SolicitacaoActionState> {
  const perm = await checkPermission('solicitacoes.create')
  if (!perm.allowed) return { message: perm.error }

  const raw = {
    colaboradorId: formData.get('colaboradorId') as string,
    tipoFolgaId: formData.get('tipoFolgaId') as string,
    dataFolga: formData.get('dataFolga') as string,
    turnoId: formData.get('turnoId') as string,
    justificativa: formData.get('justificativa') as string,
  }

  const validated = solicitacaoSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const supabaseAdmin = await createAdminClient()
  const repository = createSolicitacaoRepository(supabase)
  const service = createSolicitacaoService(repository, supabaseAdmin)

  try {
    await service.create(
      {
        colaboradorId: validated.data.colaboradorId,
        tipoFolgaId: validated.data.tipoFolgaId,
        dataFolga: validated.data.dataFolga,
        turnoId: validated.data.turnoId,
        justificativa: validated.data.justificativa || undefined,
      },
      perm.colaboradorId!,
      perm.colaboradorId!,
    )
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao criar solicitação' }
  }

  revalidatePath('/solicitacoes')
  redirect('/solicitacoes')
}

export async function approveSolicitacaoAction(
  id: string,
): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('solicitacoes.approve')
  if (!perm.allowed) return { message: perm.error }

  const validated = solicitacaoApproveSchema.safeParse({ id })
  if (!validated.success) {
    return { message: 'ID inválido' }
  }

  const supabase = await createClient()
  const supabaseAdmin = await createAdminClient()
  const repository = createSolicitacaoRepository(supabase)
  const service = createSolicitacaoService(repository, supabaseAdmin)

  try {
    await service.approve(id, perm.colaboradorId!, perm.colaboradorId!)
    revalidatePath('/solicitacoes')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao aprovar solicitação' }
  }
}

export async function rejectSolicitacaoAction(
  id: string,
  motivo: string,
): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('solicitacoes.reject')
  if (!perm.allowed) return { message: perm.error }

  const validated = solicitacaoRejectSchema.safeParse({ id, motivo })
  if (!validated.success) {
    return { message: 'Dados inválidos: motivo é obrigatório' }
  }

  const supabase = await createClient()
  const supabaseAdmin = await createAdminClient()
  const repository = createSolicitacaoRepository(supabase)
  const service = createSolicitacaoService(repository, supabaseAdmin)

  try {
    await service.reject(validated.data.id, perm.colaboradorId!, validated.data.motivo, perm.colaboradorId!)
    revalidatePath('/solicitacoes')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao reprovar solicitação' }
  }
}

export async function cancelSolicitacaoAction(
  id: string,
  motivo?: string,
): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('solicitacoes.cancel')
  if (!perm.allowed) return { message: perm.error }

  const validated = solicitacaoCancelSchema.safeParse({ id, motivo })
  if (!validated.success) {
    return { message: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const supabaseAdmin = await createAdminClient()
  const repository = createSolicitacaoRepository(supabase)
  const service = createSolicitacaoService(repository, supabaseAdmin)

  try {
    await service.cancel(id, perm.colaboradorId!, motivo ?? null, perm.colaboradorId!)
    revalidatePath('/solicitacoes')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao cancelar solicitação' }
  }
}

export async function deleteSolicitacaoAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('solicitacoes.cancel')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createSolicitacaoRepository(supabase)

  try {
    await repository.softDelete(id, perm.colaboradorId!)
    revalidatePath('/solicitacoes')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao excluir solicitação' }
  }
}
