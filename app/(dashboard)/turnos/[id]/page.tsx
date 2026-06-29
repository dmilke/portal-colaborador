import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createTurnoRepository } from '@/src/features/turnos/repositories/turno-repository'
import { createTurnoService } from '@/src/features/turnos/services/turno-service'
import { TurnoForm } from '@/src/features/turnos/components/turno-form'
import { updateTurnoAction } from '@/src/features/turnos/actions/turno-actions'

export default async function EditarTurnoPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('turnos.update')) {
    redirect('/turnos')
  }

  const supabase = await createClient()
  const repository = createTurnoRepository(supabase)
  const service = createTurnoService(repository)
  const turno = await service.getById(id)

  if (!turno) {
    notFound()
  }

  const { data: departamentos } = await supabase
    .from('departamentos')
    .select('id, nome')
    .is('deleted_at', null)
    .order('nome', { ascending: true })

  return (
    <div className="max-w-2xl mx-auto">
      <TurnoForm
        action={updateTurnoAction}
        turno={turno}
        departamentos={(departamentos ?? []) as { id: string; nome: string }[]}
      />
    </div>
  )
}
