'use client'

import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/src/shared/components/data-table'
import { DocumentoStatusBadge } from './documento-status-badge'
import { DocumentoTypeBadge } from './documento-type-badge'
import type { Documento } from '../types'

const columns: Column<Documento>[] = [
  {
    key: 'titulo',
    header: 'Título',
    sortable: true,
    render: (item) => (
      <span className="font-medium">{item.titulo}</span>
    ),
  },
  {
    key: 'tipo',
    header: 'Tipo',
    sortable: true,
    render: (item) => <DocumentoTypeBadge tipo={item.tipo} />,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (item) => <DocumentoStatusBadge status={item.status} />,
  },
  {
    key: 'versaoAtual',
    header: 'Versão',
    sortable: true,
    render: (item) => `v${item.versaoAtual}`,
  },
  {
    key: 'createdAt',
    header: 'Criado em',
    sortable: true,
    render: (item) => new Date(item.createdAt).toLocaleDateString('pt-BR'),
  },
]

interface Props {
  data: Documento[]
}

export function DocumentoTable({ data }: Props) {
  const router = useRouter()

  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder="Pesquisar por título ou descrição..."
      searchFields={['titulo', 'descricao']}
      pageSize={10}
      emptyMessage="Nenhum documento encontrado"
      onRowClick={(item) => router.push(`/documentos/${item.id}`)}
    />
  )
}
