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
import type { Turno } from '../types'
import type { TurnoActionState } from '../actions/turno-actions'

interface TurnoFormProps {
  action: (prevState: TurnoActionState, formData: FormData) => Promise<TurnoActionState>
  turno?: Turno
  departamentos: { id: string; nome: string }[]
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

export function TurnoForm({ action, turno, departamentos }: TurnoFormProps) {
  const [state, formAction] = useActionState<TurnoActionState, FormData>(action, null)
  const isEditing = !!turno

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Turno' : 'Novo Turno'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Altere os dados do turno'
            : 'Preencha os dados para criar um novo turno'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {turno && (
            <input type="hidden" name="id" value={turno.id} />
          )}

          {state?.message && !state.errors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="departamentoId">
              Departamento <span className="text-red-500">*</span>
            </Label>
            <select
              id="departamentoId"
              name="departamentoId"
              defaultValue={turno?.departamentoId ?? ''}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Selecione o departamento</option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
            {state?.errors?.departamentoId && (
              <p className="text-sm text-red-500">{state.errors.departamentoId[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome"
              name="nome"
              defaultValue={turno?.nome ?? ''}
              placeholder="Nome do turno"
            />
            {state?.errors?.nome && (
              <p className="text-sm text-red-500">{state.errors.nome[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descricao</Label>
            <Textarea
              id="descricao"
              name="descricao"
              defaultValue={turno?.descricao ?? ''}
              placeholder="Descricao do turno (opcional)"
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
