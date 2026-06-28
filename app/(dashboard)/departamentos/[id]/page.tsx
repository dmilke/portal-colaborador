import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createDepartamentoRepository } from '@/src/features/departamentos/repositories/departamento-repository'
import { createDepartamentoService } from '@/src/features/departamentos/services/departamento-service'
import { DepartamentoForm } from '@/src/features/departamentos/components/departamento-form'
import { updateDepartamentoAction } from '@/src/features/departamentos/actions/departamento-actions'

export default async function EditarDepartamentoPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('departamentos.update')) {
    redirect('/departamentos')
  }

  const supabase = await createClient()
  const repository = createDepartamentoRepository(supabase)
  const service = createDepartamentoService(repository)
  const departamento = await service.getById(id)

  if (!departamento) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <DepartamentoForm action={updateDepartamentoAction} departamento={departamento} />
    </div>
  )
}
