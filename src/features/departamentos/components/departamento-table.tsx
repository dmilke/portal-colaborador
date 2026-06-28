'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/src/shared/components/data-table'
import { AdminStatusBadge, AdminConfirmDialog, AdminActionButtons } from '@/src/shared/components/admin'
import { toast } from 'sonner'
import {
  deleteDepartamentoAction,
  restoreDepartamentoAction,
  toggleActiveDepartamentoAction,
} from '../actions/departamento-actions'
import type { Departamento } from '../types'

interface DepartamentoTableProps {
  data: Departamento[]
  permissions: string[]
  showDeleted?: boolean
  onDataChange: () => void
}

export function DepartamentoTable({ data, permissions, showDeleted, onDataChange }: DepartamentoTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const canUpdate = permissions.includes('departamentos.update')
  const canDelete = permissions.includes('departamentos.delete')

  async function handleDelete(id: string) {
    setLoading(id)
    const result = await deleteDepartamentoAction(id)
    setLoading(null)
    setDeleteId(null)
    if (result.success) {
      toast.success('Departamento excluído')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao excluir')
    }
  }

  async function handleRestore(id: string) {
    setLoading(id)
    const result = await restoreDepartamentoAction(id)
    setLoading(null)
    if (result.success) {
      toast.success('Departamento restaurado')
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
    const result = await toggleActiveDepartamentoAction(id, !item.isActive)
    setLoading(null)
    if (result.success) {
      toast.success(item.isActive ? 'Departamento desativado' : 'Departamento ativado')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao alterar status')
    }
  }

  const columns: Column<Departamento>[] = [
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
      key: 'descricao',
      header: 'Descrição',
      sortable: true,
      render: (item) => (
        <span className="text-muted-foreground truncate max-w-xs block">
          {item.descricao ?? '—'}
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
          onEdit={(id) => router.push(`/departamentos/${id}`)}
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
        emptyMessage={showDeleted ? 'Nenhum departamento encontrado' : 'Nenhum departamento ativo encontrado'}
      />

      <AdminConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir departamento"
        description="Esta ação move o departamento para a lixeira. É possível restaurá-lo depois."
        confirmLabel="Excluir"
        confirmVariant="destructive"
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </>
  )
}
