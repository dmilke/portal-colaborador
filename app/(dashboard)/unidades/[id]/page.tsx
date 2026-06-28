import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createUnidadeRepository } from '@/src/features/unidades/repositories/unidade-repository'
import { createUnidadeService } from '@/src/features/unidades/services/unidade-service'
import { UnidadeForm } from '@/src/features/unidades/components/unidade-form'
import { updateUnidadeAction } from '@/src/features/unidades/actions/unidade-actions'

export default async function EditarUnidadePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('unidades.update')) {
    redirect('/unidades')
  }

  const supabase = await createClient()
  const repository = createUnidadeRepository(supabase)
  const service = createUnidadeService(repository)
  const unidade = await service.getById(id)

  if (!unidade) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <UnidadeForm action={updateUnidadeAction} unidade={unidade} />
    </div>
  )
}
