'use client'

import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/src/shared/components/data-table'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { ComunicadoPriorityBadge } from './comunicado-priority-badge'
import type { Comunicado } from '../types'

const columns: Column<Comunicado>[] = [
  {
    key: 'titulo',
    header: 'Título',
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-2">
        {item.isPinned && (
          <span className="text-amber-500" title="Fixado">📌</span>
        )}
        <span className={`font-medium ${!item.lido ? 'font-semibold' : ''}`}>
          {item.titulo}
        </span>
      </div>
    ),
  },
  {
    key: 'categoria',
    header: 'Categoria',
    sortable: true,
    render: (item) => item.categoria ?? '-',
  },
  {
    key: 'prioridade',
    header: 'Prioridade',
    sortable: true,
    render: (item) => <ComunicadoPriorityBadge prioridade={item.prioridade} />,
  },
  {
    key: 'autorNome',
    header: 'Autor',
    sortable: true,
    render: (item) => item.autorNome ?? '-',
  },
  {
    key: 'createdAt',
    header: 'Criado em',
    sortable: true,
    render: (item) => new Date(item.createdAt).toLocaleDateString('pt-BR'),
  },
  {
    key: 'actions',
    header: 'Ações',
    className: 'w-20 text-right',
    cellClassName: 'text-right',
    render: () => (
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
]

interface Props {
  data: Comunicado[]
}

export function ComunicadoTable({ data }: Props) {
  const router = useRouter()

  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder="Pesquisar por título ou categoria..."
      searchFields={['titulo', 'categoria']}
      pageSize={10}
      emptyMessage="Nenhum comunicado encontrado"
      onRowClick={(item) => router.push(`/comunicados/${item.id}`)}
    />
  )
}
