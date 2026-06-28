import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { UnidadeForm } from '@/src/features/unidades/components/unidade-form'
import { createUnidadeAction } from '@/src/features/unidades/actions/unidade-actions'
import { redirect } from 'next/navigation'

export default async function NovaUnidadePage() {
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('unidades.create')) {
    redirect('/unidades')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <UnidadeForm action={createUnidadeAction} />
    </div>
  )
}
