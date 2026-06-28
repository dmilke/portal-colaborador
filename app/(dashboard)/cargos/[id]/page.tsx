import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createCargoRepository } from '@/src/features/cargos/repositories/cargo-repository'
import { createCargoService } from '@/src/features/cargos/services/cargo-service'
import { CargoForm } from '@/src/features/cargos/components/cargo-form'
import { updateCargoAction } from '@/src/features/cargos/actions/cargo-actions'

export default async function EditarCargoPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('cargos.update')) {
    redirect('/cargos')
  }

  const supabase = await createClient()
  const repository = createCargoRepository(supabase)
  const service = createCargoService(repository)
  const cargo = await service.getById(id)

  if (!cargo) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CargoForm action={updateCargoAction} cargo={cargo} />
    </div>
  )
}
