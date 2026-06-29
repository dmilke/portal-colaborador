import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { DocumentoService } from '@/src/features/documentos/services'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { DocumentosPageContent } from './documentos-page-content'

export default async function DocumentosPage() {
  const colaborador = await getCurrentColaborador()
  const service = new DocumentoService()
  const result = await service.list({ pageSize: 100 })
  const permissions = colaborador?.permissions ?? []

  return (
    <AdminPageLayout title="Documentos" description="Gerencie os documentos institucionais">
      <DocumentosPageContent
        initialData={result.data}
        permissions={permissions}
      />
    </AdminPageLayout>
  )
}
