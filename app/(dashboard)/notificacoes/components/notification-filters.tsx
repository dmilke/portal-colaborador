'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'

interface NotificationFiltersProps {
  currentLida?: string
  currentTipo?: string
}

const tipoOptions = [
  { value: '', label: 'Todos' },
  { value: 'solicitacao', label: 'Solicitações' },
  { value: 'documento', label: 'Documentos' },
  { value: 'comunicado', label: 'Comunicados' },
]

const lidaOptions = [
  { value: '', label: 'Todos' },
  { value: 'false', label: 'Não lidas' },
  { value: 'true', label: 'Lidas' },
]

export function NotificationFilters({ currentLida, currentTipo }: NotificationFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/notificacoes?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Filter className="h-3.5 w-3.5" />
        Status:
      </span>
      <div className="flex gap-1">
        {lidaOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={(currentLida ?? '') === opt.value ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => updateFilter('lida', opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground ml-2">Tipo:</span>
      <div className="flex gap-1">
        {tipoOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={(currentTipo ?? '') === opt.value ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => updateFilter('tipo', opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
