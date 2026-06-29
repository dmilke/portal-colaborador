import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DocumentoForm } from '@/src/features/documentos/components/documento-form'
import { createDocumento } from '@/src/features/documentos/actions'

export default async function NovoDocumentoPage() {
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('documentos.create')) {
    redirect('/documentos')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Novo Documento</CardTitle>
          <CardDescription>
            Crie um novo documento institucional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentoForm action={createDocumento} />
        </CardContent>
      </Card>
    </div>
  )
}
