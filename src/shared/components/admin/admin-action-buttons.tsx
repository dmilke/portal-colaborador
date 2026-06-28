'use client'

import { Button } from '@/components/ui/button'
import { Pencil, Trash2, RotateCcw, ToggleLeft, ToggleRight } from 'lucide-react'

interface AdminActionButtonsProps {
  entityId: string
  isActive: boolean
  deletedAt: string | null
  canUpdate: boolean
  canDelete: boolean
  onToggleActive?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onRestore?: (id: string) => void
  isLoading?: boolean
}

export function AdminActionButtons({
  entityId,
  isActive,
  deletedAt,
  canUpdate,
  canDelete,
  onToggleActive,
  onEdit,
  onDelete,
  onRestore,
  isLoading,
}: AdminActionButtonsProps) {
  if (deletedAt) {
    if (!canDelete) return null
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.stopPropagation(); onRestore?.(entityId) }}
        disabled={isLoading}
      >
        <RotateCcw className="h-4 w-4 mr-1" />
        Restaurar
      </Button>
    )
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {canUpdate && (
        <>
          {onToggleActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onToggleActive(entityId) }}
              disabled={isLoading}
              title={isActive ? 'Desativar' : 'Ativar'}
            >
              {isActive
                ? <ToggleRight className="h-4 w-4 text-emerald-600" />
                : <ToggleLeft className="h-4 w-4 text-muted-foreground" />
              }
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onEdit(entityId) }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
      {canDelete && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onDelete(entityId) }}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      )}
    </div>
  )
}
