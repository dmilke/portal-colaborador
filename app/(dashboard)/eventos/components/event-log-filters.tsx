'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Filter, X } from 'lucide-react'

const eventTypeOptions = [
  '', 'user.created', 'user.activated', 'user.deactivated',
  'login', 'logout',
  'solicitacao.created', 'solicitacao.approved', 'solicitacao.rejected', 'solicitacao.cancelled',
  'comunicado.published', 'comunicado.read',
  'documento.published', 'documento.read',
]

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'processed', label: 'Processados' },
  { value: 'failed', label: 'Falhas' },
]

export function EventLogFilters({ currentTipo, currentStatus }: { currentTipo?: string; currentStatus?: string }) {
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
    router.push(`/eventos/log?${params.toString()}`)
  }

  function clearFilters() {
    router.push('/eventos/log')
  }

  const hasFilters = currentTipo || currentStatus

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filtros</span>
      </div>

      <select
        className="h-8 rounded-md border border-input bg-background px-2 text-sm"
        value={currentTipo ?? ''}
        onChange={(e) => updateFilter('tipo', e.target.value)}
      >
        <option value="">Todos os tipos</option>
        {eventTypeOptions.filter(Boolean).map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div className="flex gap-1">
        {statusOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={(currentStatus ?? '') === opt.value ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => updateFilter('status', opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearFilters}>
          <X className="h-3 w-3 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  )
}
