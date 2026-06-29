import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { ComunicadoService } from '@/src/features/comunicados/services'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { ComunicadosPageContent } from './comunicados-page-content'

export default async function ComunicadosPage() {
  const colaborador = await getCurrentColaborador()
  const service = new ComunicadoService()
  const result = await service.list({ pageSize: 100 })
  const permissions = colaborador?.permissions ?? []

  return (
    <AdminPageLayout title="Comunicados" description="Gerencie os comunicados internos">
      <ComunicadosPageContent
        initialData={result.data}
        permissions={permissions}
      />
    </AdminPageLayout>
  )
}
