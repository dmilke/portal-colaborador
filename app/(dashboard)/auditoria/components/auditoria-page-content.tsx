'use client'

import { AuditoriaFilters } from '@/src/features/auditoria/components/auditoria-filters'
import { AuditoriaTable } from '@/src/features/auditoria/components/auditoria-table'
import type { Auditoria, AuditoriaFiltros } from '@/src/features/auditoria/types'

interface AuditoriaPageContentProps {
  data: Auditoria[]
  total: number
  filters: AuditoriaFiltros
  colaboradores: { id: string; nome: string }[]
  entidadeTipos: string[]
}

export function AuditoriaPageContent({
  data,
  total,
  filters,
  colaboradores,
  entidadeTipos,
}: AuditoriaPageContentProps) {
  return (
    <div className="space-y-4">
      <AuditoriaFilters
        colaboradores={colaboradores}
        entidadeTipos={entidadeTipos}
        initialFilters={filters}
      />

      <div className="text-sm text-muted-foreground">
        {total} registro{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
      </div>

      <AuditoriaTable data={data} total={total} />
    </div>
  )
}
