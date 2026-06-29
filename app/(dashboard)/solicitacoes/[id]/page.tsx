import { notFound } from 'next/navigation'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createSolicitacaoRepository } from '@/src/features/solicitacoes/repositories/solicitacao-repository'
import { createSolicitacaoService } from '@/src/features/solicitacoes/services/solicitacao-service'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { SolicitacaoDetail } from './solicitacao-detail'

export default async function SolicitacaoDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const currentColaborador = await getCurrentColaborador()

  const supabase = await createClient()
  const supabaseAdmin = await createAdminClient()
  const repository = createSolicitacaoRepository(supabase)
  const service = createSolicitacaoService(repository, supabaseAdmin)
  const solicitacao = await service.getById(id)

  if (!solicitacao) {
    notFound()
  }

  const auditoria = await supabaseAdmin
    .from('auditoria')
    .select(`
      id,
      colaborador_id,
      acao,
      descricao,
      created_at,
      colaborador:colaboradores!auditoria_colaborador_id_fkey ( nome )
    `)
    .eq('entidade_id', id)
    .eq('entidade_tipo', 'solicitacao')
    .order('created_at', { ascending: true })

  const timelineItems = ((auditoria.data ?? []) as unknown as {
    id: string
    colaborador_id: string | null
    acao: string
    descricao: string | null
    created_at: string
    colaborador: { nome: string }[] | { nome: string } | null
  }[]).map((item) => ({
    id: item.id,
    acao: item.acao,
    descricao: item.descricao,
    colaboradorNome: Array.isArray(item.colaborador)
      ? item.colaborador[0]?.nome ?? null
      : item.colaborador?.nome ?? null,
    createdAt: item.created_at,
  }))

  const permissions = currentColaborador?.permissions ?? []

  return (
    <AdminPageLayout title="Detalhes da Solicitação" description="Visualize e gerencie esta solicitação">
      <SolicitacaoDetail
        solicitacao={solicitacao}
        timelineItems={timelineItems}
        permissions={permissions}
        currentColaboradorId={currentColaborador!.id}
      />
    </AdminPageLayout>
  )
}
