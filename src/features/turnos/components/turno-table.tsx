'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/src/shared/components/data-table'
import { AdminStatusBadge, AdminConfirmDialog, AdminActionButtons } from '@/src/shared/components/admin'
import { toast } from 'sonner'
import {
  deleteTurnoAction,
  restoreTurnoAction,
  toggleActiveTurnoAction,
} from '../actions/turno-actions'
import type { Turno } from '../types'

interface TurnoTableProps {
  data: Turno[]
  permissions: string[]
  showDeleted?: boolean
  onDataChange: () => void
}

export function TurnoTable({ data, permissions, showDeleted, onDataChange }: TurnoTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const canUpdate = permissions.includes('turnos.update')
  const canDelete = permissions.includes('turnos.delete')

  async function handleDelete(id: string) {
    setLoading(id)
    const result = await deleteTurnoAction(id)
    setLoading(null)
    setDeleteId(null)
    if (result.success) {
      toast.success('Turno excluido')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao excluir')
    }
  }

  async function handleRestore(id: string) {
    setLoading(id)
    const result = await restoreTurnoAction(id)
    setLoading(null)
    if (result.success) {
      toast.success('Turno restaurado')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao restaurar')
    }
  }

  async function handleToggleActive(id: string) {
    setLoading(id)
    const item = data.find((t) => t.id === id)
    if (!item) return
    const result = await toggleActiveTurnoAction(id, !item.isActive)
    setLoading(null)
    if (result.success) {
      toast.success(item.isActive ? 'Turno desativado' : 'Turno ativado')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao alterar status')
    }
  }

  const columns: Column<Turno>[] = [
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
      key: 'departamentoNome',
      header: 'Departamento',
      sortable: true,
      render: (item) => (
        <span className="text-muted-foreground">
          {item.departamentoNome ?? '---'}
        </span>
      ),
    },
    {
      key: 'descricao',
      header: 'Descricao',
      sortable: true,
      render: (item) => (
        <span className="text-muted-foreground truncate max-w-xs block">
          {item.descricao ?? '---'}
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
      header: 'Acoes',
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
          onEdit={(id) => router.push(`/turnos/${id}`)}
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
        searchFields={['nome', 'departamentoNome']}
        pageSize={10}
        emptyMessage={showDeleted ? 'Nenhum turno encontrado' : 'Nenhum turno ativo encontrado'}
      />

      <AdminConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir turno"
        description="Esta acao move o turno para a lixeira. E possivel restaura-lo depois."
        confirmLabel="Excluir"
        confirmVariant="destructive"
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </>
  )
}
