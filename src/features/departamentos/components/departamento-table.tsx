'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/src/shared/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  deleteDepartamentoAction,
  restoreDepartamentoAction,
  toggleActiveDepartamentoAction,
} from '../actions/departamento-actions'
import type { Departamento } from '../types'
import { Pencil, Trash2, RotateCcw, ToggleLeft, ToggleRight } from 'lucide-react'

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

  async function handleToggleActive(id: string, currentActive: boolean) {
    setLoading(id)
    const result = await toggleActiveDepartamentoAction(id, !currentActive)
    setLoading(null)
    if (result.success) {
      toast.success(currentActive ? 'Departamento desativado' : 'Departamento ativado')
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
      render: (item) => {
        if (item.deletedAt) return <Badge variant="destructive">Excluído</Badge>
        return item.isActive
          ? <Badge variant="default" className="bg-emerald-600">Ativo</Badge>
          : <Badge variant="secondary">Inativo</Badge>
      },
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
      render: (item) => {
        const isItemLoading = loading === item.id

        if (item.deletedAt) {
          return canDelete ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); handleRestore(item.id) }}
              disabled={isItemLoading}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Restaurar
            </Button>
          ) : null
        }

        return (
          <div className="flex items-center justify-end gap-1">
            {canUpdate && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleActive(item.id, item.isActive)
                  }}
                  disabled={isItemLoading}
                  title={item.isActive ? 'Desativar' : 'Ativar'}
                >
                  {item.isActive
                    ? <ToggleRight className="h-4 w-4 text-emerald-600" />
                    : <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                  }
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/departamentos/${item.id}`)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }}
                disabled={isItemLoading}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        )
      },
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir departamento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação move o departamento para a lixeira. É possível restaurá-lo depois.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
