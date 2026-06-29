'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ComunicadoAudienciaSelect } from './comunicado-audiencia-select'
import { Loader2 } from 'lucide-react'
import type { ComunicadoActionState, Comunicado } from '../types'
import { useState } from 'react'

interface Props {
  action: (prevState: ComunicadoActionState, formData: FormData) => Promise<ComunicadoActionState>
  comunicado?: Comunicado
}

export function ComunicadoForm({ action, comunicado }: Props) {
  const [state, formAction] = useActionState<ComunicadoActionState, FormData>(action, null)
  const [audiencias, setAudiencias] = useState<{ tipo: 'departamento' | 'unidade' | 'cargo' | 'role' | 'colaborador'; alvoId: string }[]>(
    (comunicado?.audiencias?.map(a => ({ tipo: a.tipo as 'departamento' | 'unidade' | 'cargo' | 'role' | 'colaborador', alvoId: a.alvoId })) ?? [])
  )
  const [prioridade, setPrioridade] = useState<string>(comunicado?.prioridade ?? 'normal')
  const [isPinned, setIsPinned] = useState(comunicado?.isPinned ?? false)

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && !state.errors && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <input type="hidden" name="audiencias" value={JSON.stringify(audiencias)} />

      <div className="space-y-2">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          name="titulo"
          defaultValue={comunicado?.titulo}
          placeholder="Título do comunicado"
        />
        {state?.errors?.titulo && (
          <p className="text-sm text-red-500">{state.errors.titulo[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="conteudo">Conteúdo</Label>
        <Textarea
          id="conteudo"
          name="conteudo"
          defaultValue={comunicado?.conteudo}
          placeholder="Escreva o conteúdo do comunicado..."
          rows={10}
        />
        {state?.errors?.conteudo && (
          <p className="text-sm text-red-500">{state.errors.conteudo[0]}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Input
            id="categoria"
            name="categoria"
            defaultValue={comunicado?.categoria ?? ''}
            placeholder="Ex: RH, TI, Administrativo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prioridade">Prioridade</Label>
          <select
            id="prioridade"
            name="prioridade"
            value={prioridade}
            onChange={e => setPrioridade(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="baixa">Baixa</option>
            <option value="normal">Normal</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="publicacaoEm">Publicação em</Label>
          <Input
            id="publicacaoEm"
            name="publicacaoEm"
            type="datetime-local"
            defaultValue={comunicado?.publicacaoEm?.slice(0, 16) ?? ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiracaoEm">Expiração em</Label>
          <Input
            id="expiracaoEm"
            name="expiracaoEm"
            type="datetime-local"
            defaultValue={comunicado?.expiracaoEm?.slice(0, 16) ?? ''}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isPinned"
          type="checkbox"
          checked={isPinned}
          onChange={e => setIsPinned(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <input type="hidden" name="isPinned" value={isPinned ? 'true' : 'false'} />
        <Label htmlFor="isPinned">Comunicado fixado (aparece no topo)</Label>
      </div>

      <ComunicadoAudienciaSelect value={audiencias} onChange={setAudiencias} />

      <div className="flex gap-2">
        <SubmitButton />
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Salvar
    </Button>
  )
}
