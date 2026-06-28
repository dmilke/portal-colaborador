import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createDepartamentoRepository } from '@/src/features/departamentos/repositories/departamento-repository'
import { createDepartamentoService } from '@/src/features/departamentos/services/departamento-service'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { DepartamentoPageContent } from './components/departamento-page-content'

export default async function DepartamentosPage() {
  const colaborador = await getCurrentColaborador()
  const supabase = await createClient()
  const repository = createDepartamentoRepository(supabase)
  const service = createDepartamentoService(repository)
  const departamentos = await service.list()
  const permissions = colaborador?.permissions ?? []

  return (
    <AdminPageLayout title="Departamentos" description="Gerencie os departamentos da organização">
      <DepartamentoPageContent
        initialData={departamentos}
        permissions={permissions}
      />
    </AdminPageLayout>
  )
}
