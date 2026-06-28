import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ColaboradorForm } from '@/src/features/colaboradores/components/colaborador-form'
import { createColaboradorAction } from '@/src/features/colaboradores/actions/colaborador-actions'
import { redirect } from 'next/navigation'

export default async function NovoColaboradorPage() {
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('colaboradores.create')) {
    redirect('/colaboradores')
  }

  const supabase = await createClient()

  const [departamentos, cargos, unidades] = await Promise.all([
    supabase.from('departamentos').select('id, nome').is('deleted_at', null).order('nome'),
    supabase.from('cargos').select('id, nome').is('deleted_at', null).order('nome'),
    supabase.from('unidades').select('id, nome, sigla').is('deleted_at', null).order('nome'),
  ])

  return (
    <div className="max-w-3xl mx-auto">
      <ColaboradorForm
        action={createColaboradorAction}
        departamentos={departamentos.data ?? []}
        cargos={cargos.data ?? []}
        unidades={unidades.data ?? []}
      />
    </div>
  )
}
