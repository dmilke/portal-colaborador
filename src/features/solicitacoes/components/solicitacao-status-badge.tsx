'use client'

import type { SolicitacaoStatus } from '../types'
import { statusLabels, statusColors } from '../validators'
import { cn } from '@/lib/utils'

interface SolicitacaoStatusBadgeProps {
  status: SolicitacaoStatus
  className?: string
}

export function SolicitacaoStatusBadge({ status, className }: SolicitacaoStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusColors[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
