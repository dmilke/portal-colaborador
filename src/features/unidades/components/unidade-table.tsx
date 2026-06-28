'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/src/shared/components/data-table'
import { AdminStatusBadge, AdminConfirmDialog, AdminActionButtons } from '@/src/shared/components/admin'
import { toast } from 'sonner'
import {
  deleteUnidadeAction,
  restoreUnidadeAction,
  toggleActiveUnidadeAction,
} from '../actions/unidade-actions'
import type { Unidade } from '../types'

interface UnidadeTableProps {
  data: Unidade[]
  permissions: string[]
  showDeleted?: boolean
  onDataChange: () => void
}

export function UnidadeTable({ data, permissions, showDeleted, onDataChange }: UnidadeTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const canUpdate = permissions.includes('unidades.update')
  const canDelete = permissions.includes('unidades.delete')

  async function handleDelete(id: string) {
    setLoading(id)
    const result = await deleteUnidadeAction(id)
    setLoading(null)
    setDeleteId(null)
    if (result.success) {
      toast.success('Unidade excluída')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao excluir')
    }
  }

  async function handleRestore(id: string) {
    setLoading(id)
    const result = await restoreUnidadeAction(id)
    setLoading(null)
    if (result.success) {
      toast.success('Unidade restaurada')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao restaurar')
    }
  }

  async function handleToggleActive(id: string) {
    setLoading(id)
    const item = data.find((d) => d.id === id)
    if (!item) return
    const result = await toggleActiveUnidadeAction(id, !item.isActive)
    setLoading(null)
    if (result.success) {
      toast.success(item.isActive ? 'Unidade desativada' : 'Unidade ativada')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao alterar status')
    }
  }

  const columns: Column<Unidade>[] = [
    {
      key: 'nome',
      header: 'Nome',
      sortable: true,
      render: (item) => (
        <span className={`font-medium ${item.deletedAt ? 'line-through text-muted-foreground' : ''}`}>
          {item.nome}
        </span>
      ),
    },
    {
      key: 'sigla',
      header: 'Sigla',
      sortable: true,
      className: 'w-28',
      render: (item) => (
        <span className="text-muted-foreground">{item.sigla ?? '—'}</span>
      ),
    },
    {
      key: 'endereco',
      header: 'Endereço',
      sortable: true,
      render: (item) => (
        <span className="text-muted-foreground truncate max-w-xs block">
          {item.endereco ?? '—'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      className: 'w-28',
      render: (item) => (
        <AdminStatusBadge isActive={item.isActive} deletedAt={item.deletedAt} />
      ),
    },
    {
      key: 'createdAt',
      header: 'Criado em',
      sortable: true,
      className: 'w-36',
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'w-44 text-right',
      cellClassName: 'text-right',
      render: (item) => (
        <AdminActionButtons
          entityId={item.id}
          isActive={item.isActive}
          deletedAt={item.deletedAt}
          canUpdate={canUpdate}
          canDelete={canDelete}
          onToggleActive={handleToggleActive}
          onEdit={(id) => router.push(`/unidades/${id}`)}
          onDelete={setDeleteId}
          onRestore={handleRestore}
          isLoading={loading === item.id}
        />
      ),
    },
  ]

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        searchPlaceholder="Pesquisar por nome..."
        searchFields={['nome']}
        pageSize={10}
        emptyMessage={showDeleted ? 'Nenhuma unidade encontrada' : 'Nenhuma unidade ativa encontrada'}
      />

      <AdminConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir unidade"
        description="Esta ação move a unidade para a lixeira. É possível restaurá-la depois."
        confirmLabel="Excluir"
        confirmVariant="destructive"
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </>
  )
}
