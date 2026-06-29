'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/src/shared/components/data-table'
import { AdminConfirmDialog } from '@/src/shared/components/admin'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { approveSolicitacaoAction, cancelSolicitacaoAction, deleteSolicitacaoAction } from '../actions/solicitacao-actions'
import { SolicitacaoStatusBadge } from './solicitacao-status-badge'
import { canApprove, canCancel } from '../validators'
import type { Solicitacao } from '../types'

interface SolicitacaoTableProps {
  data: Solicitacao[]
  permissions: string[]
  onDataChange: () => void
}

export function SolicitacaoTable({ data, permissions, onDataChange }: SolicitacaoTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    id: string
    type: 'approve' | 'cancel' | 'delete'
  } | null>(null)

  const canApprovePerm = permissions.includes('solicitacoes.approve')
  const canCancelPerm = permissions.includes('solicitacoes.cancel')

  async function handleApprove(id: string) {
    setLoading(id)
    const result = await approveSolicitacaoAction(id)
    setLoading(null)
    setConfirmAction(null)
    if (result.success) {
      toast.success('Solicitação aprovada')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao aprovar')
    }
  }

  async function handleCancel(id: string) {
    setLoading(id)
    const result = await cancelSolicitacaoAction(id)
    setLoading(null)
    setConfirmAction(null)
    if (result.success) {
      toast.success('Solicitação cancelada')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao cancelar')
    }
  }

  async function handleDelete(id: string) {
    setLoading(id)
    const result = await deleteSolicitacaoAction(id)
    setLoading(null)
    setConfirmAction(null)
    if (result.success) {
      toast.success('Solicitação excluída')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao excluir')
    }
  }

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR')
    } catch {
      return dateStr
    }
  }

  const columns: Column<Solicitacao>[] = [
    {
      key: 'colaboradorNome',
      header: 'Colaborador',
      sortable: true,
      render: (item) => (
        <span className="font-medium">{item.colaboradorNome ?? '—'}</span>
      ),
    },
    {
      key: 'tipoFolgaNome',
      header: 'Tipo',
      sortable: true,
      className: 'w-28',
      render: (item) => (
        <span className="text-muted-foreground">{item.tipoFolgaNome ?? '—'}</span>
      ),
    },
    {
      key: 'dataFolga',
      header: 'Data',
      sortable: true,
      className: 'w-24',
      render: (item) => (
        <span>{formatDate(item.dataFolga)}</span>
      ),
    },
    {
      key: 'turnoNome',
      header: 'Turno',
      className: 'w-20',
      render: (item) => (
        <span className="text-muted-foreground">{item.turnoNome ?? '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'w-28',
      sortable: true,
      render: (item) => (
        <SolicitacaoStatusBadge status={item.status} />
      ),
    },
    {
      key: 'solicitadoEm',
      header: 'Solicitado em',
      className: 'w-28',
      sortable: true,
      render: (item) => (
        <span className="text-muted-foreground text-sm">{formatDate(item.solicitadoEm)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'w-32 text-right',
      cellClassName: 'text-right',
      render: (item) => {
        const showApprove = canApprovePerm && canApprove(item.status)
        const showCancel = canCancelPerm && canCancel(item.status)

        if (!showApprove && !showCancel) {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/solicitacoes/${item.id}`)}
            >
              Detalhes
            </Button>
          )
        }

        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/solicitacoes/${item.id}`)}
            >
              Detalhes
            </Button>
            {showApprove && (
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                disabled={loading === item.id}
                onClick={() => setConfirmAction({ id: item.id, type: 'approve' })}
              >
                Aprovar
              </Button>
            )}
            {showCancel && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                disabled={loading === item.id}
                onClick={() => setConfirmAction({ id: item.id, type: 'cancel' })}
              >
                Cancelar
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const confirmDialogConfig = confirmAction
    ? {
        approve: {
          title: 'Aprovar solicitação',
          description: 'Tem certeza que deseja aprovar esta solicitação de folga?',
          confirmLabel: 'Aprovar',
          confirmVariant: 'default' as const,
          onConfirm: () => handleApprove(confirmAction.id),
        },
        cancel: {
          title: 'Cancelar solicitação',
          description: 'Tem certeza que deseja cancelar esta solicitação de folga?',
          confirmLabel: 'Cancelar',
          confirmVariant: 'destructive' as const,
          onConfirm: () => handleCancel(confirmAction.id),
        },
        delete: {
          title: 'Excluir solicitação',
          description: 'Tem certeza que deseja excluir esta solicitação? Esta ação é irreversível.',
          confirmLabel: 'Excluir',
          confirmVariant: 'destructive' as const,
          onConfirm: () => handleDelete(confirmAction.id),
        },
      }[confirmAction.type]
    : null

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        searchPlaceholder="Pesquisar por colaborador ou tipo..."
        searchFields={['colaboradorNome', 'tipoFolgaNome']}
        pageSize={10}
        emptyMessage="Nenhuma solicitação encontrada"
      />

      {confirmDialogConfig && (
        <AdminConfirmDialog
          open={!!confirmAction}
          onOpenChange={(open) => !open && setConfirmAction(null)}
          title={confirmDialogConfig.title}
          description={confirmDialogConfig.description}
          confirmLabel={confirmDialogConfig.confirmLabel}
          confirmVariant={confirmDialogConfig.confirmVariant}
          onConfirm={confirmDialogConfig.onConfirm}
        />
      )}
    </>
  )
}
