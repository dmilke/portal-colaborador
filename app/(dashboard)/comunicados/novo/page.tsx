import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ComunicadoForm } from '@/src/features/comunicados/components/comunicado-form'
import { createComunicado } from '@/src/features/comunicados/actions'

export default async function NovoComunicadoPage() {
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('comunicados.create')) {
    redirect('/comunicados')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Novo Comunicado</CardTitle>
          <CardDescription>
            Crie um novo comunicado interno para os colaboradores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ComunicadoForm action={createComunicado} />
        </CardContent>
      </Card>
    </div>
  )
}
