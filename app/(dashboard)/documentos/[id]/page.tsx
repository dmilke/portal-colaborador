import { notFound } from 'next/navigation'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { DocumentoService } from '@/src/features/documentos/services'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { DocumentoDetail } from '@/src/features/documentos/components/documento-detail'

export default async function DocumentoDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const currentColaborador = await getCurrentColaborador()
  const service = new DocumentoService()
  const documento = await service.getById(id)

  if (!documento) {
    notFound()
  }

  const [versions, leitores] = await Promise.all([
    service.getVersions(id),
    service.getLeitores(id),
  ])

  const permissions = currentColaborador?.permissions ?? []
  const canUpdate = permissions.includes('documentos.update')
  const canDelete = permissions.includes('documentos.delete')
  const canPublish = permissions.includes('documentos.publish')
  const canArchive = permissions.includes('documentos.archive')

  return (
    <AdminPageLayout
      title={documento.titulo}
      description="Detalhes do documento"
    >
      <DocumentoDetail
        documento={documento}
        versions={versions}
        leitores={leitores}
        canUpdate={canUpdate}
        canDelete={canDelete}
        canPublish={canPublish}
        canArchive={canArchive}
      />
    </AdminPageLayout>
  )
}
