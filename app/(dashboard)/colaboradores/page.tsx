import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createColaboradorRepository } from '@/src/features/colaboradores/repositories/colaborador-repository'
import { createColaboradorService } from '@/src/features/colaboradores/services/colaborador-service'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { ColaboradorPageContent } from './components/colaborador-page-content'

export default async function ColaboradoresPage() {
  const colaborador = await getCurrentColaborador()
  const supabase = await createClient()
  const repository = createColaboradorRepository(supabase)
  const service = createColaboradorService(repository)
  const result = await service.list({ pageSize: 100 })
  const permissions = colaborador?.permissions ?? []

  return (
    <AdminPageLayout title="Colaboradores" description="Gerencie os colaboradores da organização">
      <ColaboradorPageContent
        initialData={result.data}
        permissions={permissions}
      />
    </AdminPageLayout>
  )
}
