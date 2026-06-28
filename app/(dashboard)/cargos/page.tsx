import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createCargoRepository } from '@/src/features/cargos/repositories/cargo-repository'
import { createCargoService } from '@/src/features/cargos/services/cargo-service'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { CargosPageContent } from './components/cargos-page-content'

export default async function CargosPage() {
  const colaborador = await getCurrentColaborador()
  const supabase = await createClient()
  const repository = createCargoRepository(supabase)
  const service = createCargoService(repository)
  const cargos = await service.list()
  const permissions = colaborador?.permissions ?? []

  return (
    <AdminPageLayout title="Cargos" description="Gerencie os cargos da organização">
      <CargosPageContent initialData={cargos} permissions={permissions} />
    </AdminPageLayout>
  )
}
