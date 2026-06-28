import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createUnidadeRepository } from '@/src/features/unidades/repositories/unidade-repository'
import { createUnidadeService } from '@/src/features/unidades/services/unidade-service'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { UnidadePageContent } from './components/unidade-page-content'

export default async function UnidadesPage() {
  const colaborador = await getCurrentColaborador()
  const supabase = await createClient()
  const repository = createUnidadeRepository(supabase)
  const service = createUnidadeService(repository)
  const unidades = await service.list()
  const permissions = colaborador?.permissions ?? []

  return (
    <AdminPageLayout title="Unidades" description="Gerencie as unidades da organização">
      <UnidadePageContent
        initialData={unidades}
        permissions={permissions}
      />
    </AdminPageLayout>
  )
}
