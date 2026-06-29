import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { TurnoForm } from '@/src/features/turnos/components/turno-form'
import { createTurnoAction } from '@/src/features/turnos/actions/turno-actions'

export default async function NovoTurnoPage() {
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('turnos.create')) {
    redirect('/turnos')
  }

  const supabase = await createClient()
  const { data: departamentos } = await supabase
    .from('departamentos')
    .select('id, nome')
    .is('deleted_at', null)
    .order('nome', { ascending: true })

  return (
    <div className="max-w-2xl mx-auto">
      <TurnoForm
        action={createTurnoAction}
        departamentos={(departamentos ?? []) as { id: string; nome: string }[]}
      />
    </div>
  )
}
