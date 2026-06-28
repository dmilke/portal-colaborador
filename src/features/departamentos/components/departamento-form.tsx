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
import type { Departamento } from '../types'
import type { DepartamentoActionState } from '../actions/departamento-actions'

interface DepartamentoFormProps {
  action: (prevState: DepartamentoActionState, formData: FormData) => Promise<DepartamentoActionState>
  departamento?: Departamento
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

export function DepartamentoForm({ action, departamento }: DepartamentoFormProps) {
  const [state, formAction] = useActionState<DepartamentoActionState, FormData>(action, null)
  const isEditing = !!departamento

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Departamento' : 'Novo Departamento'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Altere os dados do departamento'
            : 'Preencha os dados para criar um novo departamento'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {departamento && (
            <input type="hidden" name="id" value={departamento.id} />
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
              defaultValue={departamento?.nome ?? ''}
              placeholder="Nome do departamento"
            />
            {state?.errors?.nome && (
              <p className="text-sm text-red-500">{state.errors.nome[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              defaultValue={departamento?.descricao ?? ''}
              placeholder="Descrição do departamento (opcional)"
              rows={3}
            />
            {state?.errors?.descricao && (
              <p className="text-sm text-red-500">{state.errors.descricao[0]}</p>
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
