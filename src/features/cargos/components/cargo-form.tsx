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
import type { Cargo } from '../types'
import type { CargoActionState } from '../actions/cargo-actions'

interface CargoFormProps {
  action: (prevState: CargoActionState, formData: FormData) => Promise<CargoActionState>
  cargo?: Cargo
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

export function CargoForm({ action, cargo }: CargoFormProps) {
  const [state, formAction] = useActionState<CargoActionState, FormData>(action, null)
  const isEditing = !!cargo

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Cargo' : 'Novo Cargo'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Altere os dados do cargo'
            : 'Preencha os dados para criar um novo cargo'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {cargo && (
            <input type="hidden" name="id" value={cargo.id} />
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
              defaultValue={cargo?.nome ?? ''}
              placeholder="Nome do cargo"
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
              defaultValue={cargo?.descricao ?? ''}
              placeholder="Descrição do cargo (opcional)"
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
