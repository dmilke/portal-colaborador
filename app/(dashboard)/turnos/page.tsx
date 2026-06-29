import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createTurnoRepository } from '@/src/features/turnos/repositories/turno-repository'
import { createTurnoService } from '@/src/features/turnos/services/turno-service'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { TurnosPageContent } from './components/turnos-page-content'

export default async function TurnosPage() {
  const colaborador = await getCurrentColaborador()
  const supabase = await createClient()
  const repository = createTurnoRepository(supabase)
  const service = createTurnoService(repository)
  const turnos = await service.list()
  const permissions = colaborador?.permissions ?? []

  return (
    <AdminPageLayout title="Turnos" description="Gerencie os turnos da organizacao">
      <TurnosPageContent initialData={turnos} permissions={permissions} />
    </AdminPageLayout>
  )
}
