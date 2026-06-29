import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createAuditoriaRepository } from '@/src/features/auditoria/repositories/auditoria-repository'
import { createAuditoriaService } from '@/src/features/auditoria/services/auditoria-service'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { AuditoriaPageContent } from './components/auditoria-page-content'

export default async function AuditoriaPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('auditoria.consultar')) {
    return (
      <AdminPageLayout title="Auditoria" description="Acesso negado">
        <p className="text-muted-foreground">Voce nao tem permissao para acessar este modulo.</p>
      </AdminPageLayout>
    )
  }

  const searchParams = await props.searchParams
  const filters = {
    dataInicio: searchParams.dataInicio,
    dataFim: searchParams.dataFim,
    colaboradorId: searchParams.colaboradorId,
    acao: searchParams.acao,
    entidadeTipo: searchParams.entidadeTipo,
    entidadeId: searchParams.entidadeId,
  }

  const supabase = await createClient()
  const repository = createAuditoriaRepository(supabase)
  const service = createAuditoriaService(repository)

  const [result, colaboradores, entidadeTipos] = await Promise.all([
    service.list(filters, 0, 20),
    repository.getColaboradores(),
    repository.getEntidadeTipos(),
  ])

  return (
    <AdminPageLayout title="Auditoria" description="Consulte o registro de auditoria do sistema">
      <AuditoriaPageContent
        data={result.data}
        total={result.total}
        filters={filters}
        colaboradores={colaboradores}
        entidadeTipos={entidadeTipos}
      />
    </AdminPageLayout>
  )
}
