import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createSolicitacaoRepository } from '@/src/features/solicitacoes/repositories/solicitacao-repository'
import { createSolicitacaoService } from '@/src/features/solicitacoes/services/solicitacao-service'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { SolicitacaoPageContent } from './components/solicitacao-page-content'

export default async function SolicitacoesPage() {
  const colaborador = await getCurrentColaborador()
  const supabase = await createClient()
  const supabaseAdmin = await createAdminClient()
  const repository = createSolicitacaoRepository(supabase)
  const service = createSolicitacaoService(repository, supabaseAdmin)
  const result = await service.list({ pageSize: 100 })
  const permissions = colaborador?.permissions ?? []

  return (
    <AdminPageLayout title="Solicitações" description="Gerencie as solicitações de folga dos colaboradores">
      <SolicitacaoPageContent
        initialData={result.data}
        permissions={permissions}
      />
    </AdminPageLayout>
  )
}
