'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/src/shared/components/data-table'
import { AdminStatusBadge, AdminConfirmDialog, AdminActionButtons } from '@/src/shared/components/admin'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  deleteColaboradorAction,
  restoreColaboradorAction,
  toggleActiveColaboradorAction,
} from '../actions/colaborador-actions'
import type { Colaborador } from '../types'

interface ColaboradorTableProps {
  data: Colaborador[]
  permissions: string[]
  showDeleted?: boolean
  onDataChange: () => void
}

export function ColaboradorTable({ data, permissions, showDeleted, onDataChange }: ColaboradorTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const canUpdate = permissions.includes('colaboradores.update')
  const canDelete = permissions.includes('colaboradores.delete')

  async function handleDelete(id: string) {
    setLoading(id)
    const result = await deleteColaboradorAction(id)
    setLoading(null)
    setDeleteId(null)
    if (result.success) {
      toast.success('Colaborador excluído')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao excluir')
    }
  }

  async function handleRestore(id: string) {
    setLoading(id)
    const result = await restoreColaboradorAction(id)
    setLoading(null)
    if (result.success) {
      toast.success('Colaborador restaurado')
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
    const result = await toggleActiveColaboradorAction(id, !item.isActive)
    setLoading(null)
    if (result.success) {
      toast.success(item.isActive ? 'Colaborador desativado' : 'Colaborador ativado')
      onDataChange()
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao alterar status')
    }
  }

  const columns: Column<Colaborador>[] = [
    {
      key: 'nome',
      header: 'Nome',
      sortable: true,
      render: (item) => (
        <div>
          <span className={`font-medium ${item.deletedAt ? 'line-through text-muted-foreground' : ''}`}>
            {item.nome}
          </span>
          {item.authUserId && (
            <span className="ml-2 text-xs text-green-600" title="Usuário ativo">●</span>
          )}
        </div>
      ),
    },
    {
      key: 'matricula',
      header: 'Matrícula',
      className: 'w-28',
      render: (item) => (
        <span className="text-muted-foreground">{item.matricula ?? '—'}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (item) => (
        <span className="text-muted-foreground truncate max-w-xs block">
          {item.email ?? '—'}
        </span>
      ),
    },
    {
      key: 'departamentoNome',
      header: 'Departamento',
      sortable: true,
      className: 'w-36',
      render: (item) => (
        <span className="text-muted-foreground">{item.departamentoNome ?? '—'}</span>
      ),
    },
    {
      key: 'cargoNome',
      header: 'Cargo',
      sortable: true,
      className: 'w-36',
      render: (item) => (
        <span className="text-muted-foreground">{item.cargoNome ?? '—'}</span>
      ),
    },
    {
      key: 'roles',
      header: 'Funções',
      className: 'w-32',
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.roles.length > 0
            ? item.roles.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))
            : <span className="text-muted-foreground text-sm">—</span>}
        </div>
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
          onEdit={(id) => router.push(`/colaboradores/${id}`)}
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
        searchPlaceholder="Pesquisar por nome, matrícula, CPF..."
        searchFields={['nome', 'matricula']}
        pageSize={10}
        emptyMessage={showDeleted ? 'Nenhum colaborador encontrado' : 'Nenhum colaborador ativo encontrado'}
      />

      <AdminConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir colaborador"
        description="Esta ação move o colaborador para a lixeira. O usuário ainda poderá acessar o sistema se tiver conta ativa."
        confirmLabel="Excluir"
        confirmVariant="destructive"
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </>
  )
}
