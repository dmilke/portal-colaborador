import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { DepartamentoForm } from '@/src/features/departamentos/components/departamento-form'
import { createDepartamentoAction } from '@/src/features/departamentos/actions/departamento-actions'
import { redirect } from 'next/navigation'

export default async function NovoDepartamentoPage() {
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('departamentos.create')) {
    redirect('/departamentos')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <DepartamentoForm action={createDepartamentoAction} />
    </div>
  )
}
