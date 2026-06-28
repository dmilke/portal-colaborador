import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createColaboradorRepository } from '@/src/features/colaboradores/repositories/colaborador-repository'
import { createColaboradorService } from '@/src/features/colaboradores/services/colaborador-service'
import { ColaboradorForm } from '@/src/features/colaboradores/components/colaborador-form'
import { ColaboradorProfile } from '@/src/features/colaboradores/components/colaborador-profile'
import { ColaboradorRoles } from '@/src/features/colaboradores/components/colaborador-roles'
import { updateColaboradorAction } from '@/src/features/colaboradores/actions/colaborador-actions'

export default async function ColaboradorDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const currentColaborador = await getCurrentColaborador()

  if (!currentColaborador?.permissions.includes('colaboradores.update')) {
    redirect('/colaboradores')
  }

  const supabase = await createClient()
  const repository = createColaboradorRepository(supabase)
  const service = createColaboradorService(repository)
  const colaborador = await service.getById(id)

  if (!colaborador) {
    notFound()
  }

  const [departamentos, cargos, unidades, allRoles, currentRoles] = await Promise.all([
    supabase.from('departamentos').select('id, nome').is('deleted_at', null).order('nome'),
    supabase.from('cargos').select('id, nome').is('deleted_at', null).order('nome'),
    supabase.from('unidades').select('id, nome, sigla').is('deleted_at', null).order('nome'),
    service.getAllRoles(),
    service.getRoles(id),
  ])

  const canAssign = currentColaborador.permissions.includes('colaboradores.update')

  return (
    <div className="space-y-8">
      <ColaboradorProfile colaborador={colaborador} />

      <div className="max-w-3xl mx-auto">
        <ColaboradorRoles
          colaboradorId={id}
          currentRoles={currentRoles}
          allRoles={allRoles}
          canAssign={canAssign}
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <ColaboradorForm
          action={updateColaboradorAction}
          colaborador={colaborador}
          departamentos={departamentos.data ?? []}
          cargos={cargos.data ?? []}
          unidades={unidades.data ?? []}
        />
      </div>
    </div>
  )
}
