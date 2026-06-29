'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import type { AuditoriaFiltros } from '../types'

interface AuditoriaFiltersProps {
  colaboradores: { id: string; nome: string }[]
  entidadeTipos: string[]
  initialFilters: AuditoriaFiltros
}

const acaoOptions = [
  { value: 'login', label: 'Login' },
  { value: 'cadastro', label: 'Cadastro' },
  { value: 'alteracao', label: 'Alteracao' },
  { value: 'solicitacao', label: 'Solicitacao' },
  { value: 'aprovacao', label: 'Aprovacao' },
  { value: 'reprovacao', label: 'Reprovacao' },
  { value: 'cancelamento', label: 'Cancelamento' },
  { value: 'alteracao_equipe', label: 'Alteracao de Equipe' },
  { value: 'alteracao_configuracoes', label: 'Alteracao de Configuracoes' },
]

export function AuditoriaFilters({ colaboradores, entidadeTipos, initialFilters }: AuditoriaFiltersProps) {
  const router = useRouter()
  const [filters, setFilters] = useState<AuditoriaFiltros>(initialFilters)

  function applyFilters() {
    const params = new URLSearchParams()
    if (filters.dataInicio) params.set('dataInicio', filters.dataInicio)
    if (filters.dataFim) params.set('dataFim', filters.dataFim)
    if (filters.colaboradorId) params.set('colaboradorId', filters.colaboradorId)
    if (filters.acao) params.set('acao', filters.acao)
    if (filters.entidadeTipo) params.set('entidadeTipo', filters.entidadeTipo)
    if (filters.entidadeId) params.set('entidadeId', filters.entidadeId)
    router.push(`/auditoria?${params.toString()}`)
  }

  function clearFilters() {
    setFilters({})
    router.push('/auditoria')
  }

  function updateFilter(key: keyof AuditoriaFiltros, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filtros</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Data Inicio</label>
          <Input
            type="date"
            value={filters.dataInicio ?? ''}
            onChange={(e) => updateFilter('dataInicio', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Data Fim</label>
          <Input
            type="date"
            value={filters.dataFim ?? ''}
            onChange={(e) => updateFilter('dataFim', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Colaborador</label>
          <select
            value={filters.colaboradorId ?? ''}
            onChange={(e) => updateFilter('colaboradorId', e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Todos</option>
            {colaboradores.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Acao</label>
          <select
            value={filters.acao ?? ''}
            onChange={(e) => updateFilter('acao', e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Todas</option>
            {acaoOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Tipo de Entidade</label>
          <select
            value={filters.entidadeTipo ?? ''}
            onChange={(e) => updateFilter('entidadeTipo', e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Todos</option>
            {entidadeTipos.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">ID da Entidade</label>
          <Input
            placeholder="UUID da entidade"
            value={filters.entidadeId ?? ''}
            onChange={(e) => updateFilter('entidadeId', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={applyFilters} size="sm">
          <Search className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </div>
    </div>
  )
}
