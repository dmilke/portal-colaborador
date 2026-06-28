'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import type { Unidade } from '../types'
import type { UnidadeActionState } from '../actions/unidade-actions'

interface UnidadeFormProps {
  action: (prevState: UnidadeActionState, formData: FormData) => Promise<UnidadeActionState>
  unidade?: Unidade
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      Salvar
    </Button>
  )
}

export function UnidadeForm({ action, unidade }: UnidadeFormProps) {
  const [state, formAction] = useActionState<UnidadeActionState, FormData>(action, null)
  const isEditing = !!unidade

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Unidade' : 'Nova Unidade'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Altere os dados da unidade'
            : 'Preencha os dados para criar uma nova unidade'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {unidade && (
            <input type="hidden" name="id" value={unidade.id} />
          )}

          {state?.message && !state.errors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="nome">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome"
              name="nome"
              defaultValue={unidade?.nome ?? ''}
              placeholder="Nome da unidade"
            />
            {state?.errors?.nome && (
              <p className="text-sm text-red-500">{state.errors.nome[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sigla">Sigla</Label>
            <Input
              id="sigla"
              name="sigla"
              defaultValue={unidade?.sigla ?? ''}
              placeholder="Sigla da unidade (opcional)"
              maxLength={20}
            />
            {state?.errors?.sigla && (
              <p className="text-sm text-red-500">{state.errors.sigla[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              name="endereco"
              defaultValue={unidade?.endereco ?? ''}
              placeholder="Endereço da unidade (opcional)"
              rows={3}
            />
            {state?.errors?.endereco && (
              <p className="text-sm text-red-500">{state.errors.endereco[0]}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton />
            <Button variant="outline" type="button" onClick={() => window.history.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
