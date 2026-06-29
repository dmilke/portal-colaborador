'use client'

import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/src/shared/components/data-table'
import type { Auditoria } from '../types'

interface AuditoriaTableProps {
  data: Auditoria[]
  total: number
}

function acaoBadge(acao: string) {
  const colors: Record<string, string> = {
    login: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    cadastro: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    alteracao: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    solicitacao: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    aprovacao: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    reprovacao: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelamento: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    alteracao_equipe: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    alteracao_configuracoes: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  }
  return colors[acao] ?? 'bg-gray-100 text-gray-800'
}

export function AuditoriaTable({ data }: AuditoriaTableProps) {
  const router = useRouter()

  const columns: Column<Auditoria>[] = [
    {
      key: 'createdAt',
      header: 'Data/Hora',
      sortable: true,
      className: 'w-40',
      render: (item) => (
        <span className="text-sm">
          {new Date(item.createdAt).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'colaboradorNome',
      header: 'Colaborador',
      sortable: true,
      render: (item) => (
        <span className="text-sm">
          {item.colaboradorNome ?? 'Sistema'}
        </span>
      ),
    },
    {
      key: 'acao',
      header: 'Acao',
      sortable: true,
      className: 'w-36',
      render: (item) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${acaoBadge(item.acao)}`}>
          {item.acao.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'entidadeTipo',
      header: 'Entidade',
      sortable: true,
      className: 'w-32',
      render: (item) => (
        <span className="text-sm text-muted-foreground">{item.entidadeTipo}</span>
      ),
    },
    {
      key: 'descricao',
      header: 'Descricao',
      render: (item) => (
        <span className="text-sm text-muted-foreground truncate max-w-xs block">
          {item.descricao ?? '---'}
        </span>
      ),
    },
    {
      key: 'id',
      header: '',
      className: 'w-12',
      render: (item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/auditoria/${item.id}`)
          }}
          className="text-sm text-primary hover:underline"
        >
          Ver
        </button>
      ),
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder="Pesquisar por descricao..."
      searchFields={['descricao', 'colaboradorNome']}
      pageSize={20}
      emptyMessage="Nenhum registro de auditoria encontrado"
      onRowClick={(item) => router.push(`/auditoria/${item.id}`)}
    />
  )
}
