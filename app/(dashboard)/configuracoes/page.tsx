import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createConfiguracaoRepository } from '@/src/features/configuracoes/repositories/configuracao-repository'
import { createConfiguracaoService } from '@/src/features/configuracoes/services/configuracao-service'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { ConfiguracoesPageContent } from './components/configuracoes-page-content'

export default async function ConfiguracoesPage() {
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('configuracao.editar')) {
    return (
      <AdminPageLayout title="Configuracoes" description="Acesso negado">
        <p className="text-muted-foreground">Voce nao tem permissao para acessar este modulo.</p>
      </AdminPageLayout>
    )
  }

  const supabase = await createClient()
  const repository = createConfiguracaoRepository(supabase)
  const service = createConfiguracaoService(repository)
  const categories = await service.listGrouped()

  return (
    <AdminPageLayout title="Configuracoes" description="Gerencie as configuracoes do sistema">
      <ConfiguracoesPageContent categories={categories} />
    </AdminPageLayout>
  )
}
