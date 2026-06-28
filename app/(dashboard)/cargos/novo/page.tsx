import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { CargoForm } from '@/src/features/cargos/components/cargo-form'
import { createCargoAction } from '@/src/features/cargos/actions/cargo-actions'
import { redirect } from 'next/navigation'

export default async function NovoCargoPage() {
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('cargos.create')) {
    redirect('/cargos')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CargoForm action={createCargoAction} />
    </div>
  )
}
