'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

interface AudienciaItem {
  tipo: 'departamento' | 'unidade' | 'cargo' | 'role' | 'colaborador'
  alvoId: string
}

interface Props {
  value: AudienciaItem[]
  onChange: (items: AudienciaItem[]) => void
}

const tipoLabels: Record<string, string> = {
  departamento: 'Departamento',
  unidade: 'Unidade',
  cargo: 'Cargo',
  role: 'Função',
  colaborador: 'Colaborador',
}

export function ComunicadoAudienciaSelect({ value, onChange }: Props) {
  const [tipo, setTipo] = useState<string>('departamento')
  const [alvoId, setAlvoId] = useState('')

  function add() {
    if (!alvoId.trim()) return
    onChange([...value, { tipo: tipo as AudienciaItem['tipo'], alvoId: alvoId.trim() }])
    setAlvoId('')
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  const hiddenInput = (
    <input type="hidden" name="audiencias" value={JSON.stringify(value)} />
  )

  return (
    <div className="space-y-3">
      {hiddenInput}
      <Label>Público-alvo</Label>
      <p className="text-sm text-muted-foreground">
        Se nenhum alvo for adicionado, o comunicado será visível para todos.
      </p>
      <div className="flex gap-2">
        <select
          value={tipo}
          onChange={e => setTipo(e.target.value)}
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
          value={alvoId}
          onChange={e => setAlvoId(e.target.value)}
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={add} disabled={!alvoId.trim()}>
          Adicionar
        </Button>
      </div>
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((item, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                {tipoLabels[item.tipo]}
              </span>
              <span className="flex-1 font-mono text-xs">{item.alvoId}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
