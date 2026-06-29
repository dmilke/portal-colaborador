'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import type { DocumentoActionState, Documento } from '../types'
import { DOCUMENTO_TIPOS } from '../types'

interface Props {
  action: (prevState: DocumentoActionState, formData: FormData) => Promise<DocumentoActionState>
  documento?: Documento
}

export function DocumentoForm({ action, documento }: Props) {
  const [state, formAction] = useActionState<DocumentoActionState, FormData>(action, null)
  const [audiencias, setAudiencias] = useState<{ tipo: string; alvoId: string }[]>(
    (documento?.audiencias?.map(a => ({ tipo: a.tipo, alvoId: a.alvoId })) ?? [])
  )
  const [audienciaTipo, setAudienciaTipo] = useState('departamento')
  const [audienciaAlvoId, setAudienciaAlvoId] = useState('')

  function addAudiencia() {
    if (!audienciaAlvoId.trim()) return
    setAudiencias([...audiencias, { tipo: audienciaTipo, alvoId: audienciaAlvoId.trim() }])
    setAudienciaAlvoId('')
  }

  function removeAudiencia(index: number) {
    setAudiencias(audiencias.filter((_, i) => i !== index))
  }

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
          defaultValue={documento?.titulo}
          placeholder="Título do documento"
        />
        {state?.errors?.titulo && (
          <p className="text-sm text-red-500">{state.errors.titulo[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          name="descricao"
          defaultValue={documento?.descricao ?? ''}
          placeholder="Descrição do documento..."
          rows={5}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Documento</Label>
          <select
            id="tipo"
            name="tipo"
            defaultValue={documento?.tipo ?? 'Regulamentos'}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {DOCUMENTO_TIPOS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {state?.errors?.tipo && (
            <p className="text-sm text-red-500">{state.errors.tipo[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Input
            id="categoria"
            name="categoria"
            defaultValue={documento?.categoria ?? ''}
            placeholder="Ex: RH, TI, Administrativo"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="publicacaoEm">Publicação em</Label>
          <Input
            id="publicacaoEm"
            name="publicacaoEm"
            type="datetime-local"
            defaultValue={documento?.publicacaoEm?.slice(0, 16) ?? ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiracaoEm">Expiração em</Label>
          <Input
            id="expiracaoEm"
            name="expiracaoEm"
            type="datetime-local"
            defaultValue={documento?.expiracaoEm?.slice(0, 16) ?? ''}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Público-alvo</Label>
        <p className="text-sm text-muted-foreground">
          Se nenhum alvo for adicionado, o documento será visível para todos.
        </p>
        <div className="flex gap-2">
          <select
            value={audienciaTipo}
            onChange={e => setAudienciaTipo(e.target.value)}
            className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="departamento">Departamento</option>
            <option value="unidade">Unidade</option>
            <option value="cargo">Cargo</option>
            <option value="role">Função</option>
            <option value="colaborador">Colaborador</option>
          </select>
          <Input
            placeholder="ID do alvo"
            value={audienciaAlvoId}
            onChange={e => setAudienciaAlvoId(e.target.value)}
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addAudiencia} disabled={!audienciaAlvoId.trim()}>
            Adicionar
          </Button>
        </div>
        {audiencias.length > 0 && (
          <div className="space-y-2">
            {audiencias.map((item, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {item.tipo}
                </span>
                <span className="flex-1 font-mono text-xs">{item.alvoId}</span>
                <button
                  type="button"
                  onClick={() => removeAudiencia(i)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
