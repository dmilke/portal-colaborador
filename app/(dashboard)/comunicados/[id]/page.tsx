import { notFound } from 'next/navigation'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { ComunicadoService } from '@/src/features/comunicados/services'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { ComunicadoDetail } from '@/src/features/comunicados/components/comunicado-detail'

export default async function ComunicadoDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const currentColaborador = await getCurrentColaborador()
  const service = new ComunicadoService()
  const comunicado = await service.getById(id)

  if (!comunicado) {
    notFound()
  }

  const permissions = currentColaborador?.permissions ?? []
  const canUpdate = permissions.includes('comunicados.update')
  const canDelete = permissions.includes('comunicados.delete')

  return (
    <AdminPageLayout
      title={comunicado.titulo}
      description="Detalhes do comunicado"
    >
      <ComunicadoDetail
        comunicado={comunicado}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    </AdminPageLayout>
  )
}
