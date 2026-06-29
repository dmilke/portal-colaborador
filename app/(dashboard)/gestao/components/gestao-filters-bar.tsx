'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Filter, X } from 'lucide-react'

interface GestaoFiltersBarProps {
  currentFilters: {
    departamentoId?: string
    unidadeId?: string
    cargoId?: string
    dateFrom?: string
    dateTo?: string
  }
}

export function GestaoFiltersBar({ currentFilters }: GestaoFiltersBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/gestao?${params.toString()}`)
  }

  function clearFilters() {
    router.push('/gestao')
  }

  const hasFilters = Object.values(currentFilters).some(Boolean)

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filtros</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-muted-foreground">De:</label>
          <input
            type="date"
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
            value={currentFilters.dateFrom ?? ''}
            onChange={(e) => updateFilter('dateFrom', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-muted-foreground">Até:</label>
          <input
            type="date"
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
            value={currentFilters.dateTo ?? ''}
            onChange={(e) => updateFilter('dateTo', e.target.value)}
          />
        </div>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearFilters}>
          <X className="h-3 w-3 mr-1" />
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
