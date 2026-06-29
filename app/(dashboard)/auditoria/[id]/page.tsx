import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createAuditoriaRepository } from '@/src/features/auditoria/repositories/auditoria-repository'
import { createAuditoriaService } from '@/src/features/auditoria/services/auditoria-service'
import { AdminPageLayout } from '@/src/shared/components/admin'
import { AuditoriaDetail } from '@/src/features/auditoria/components/auditoria-detail'

export default async function AuditoriaDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('auditoria.consultar')) {
    redirect('/auditoria')
  }

  const supabase = await createClient()
  const repository = createAuditoriaRepository(supabase)
  const service = createAuditoriaService(repository)
  const item = await service.getById(id)

  if (!item) {
    notFound()
  }

  return (
    <AdminPageLayout title="Auditoria" description={`Registro ${id.slice(0, 8)}...`}>
      <AuditoriaDetail item={item} />
    </AdminPageLayout>
  )
}
