import type { SolicitacaoStatus } from '../types'

export function isValidTransition(
  currentStatus: SolicitacaoStatus,
  targetStatus: SolicitacaoStatus,
): boolean {
  const transitions: Record<SolicitacaoStatus, SolicitacaoStatus[]> = {
    pendente: ['aprovada', 'reprovada', 'cancelada', 'expirada'],
    aprovada: [],
    reprovada: [],
    cancelada: [],
    expirada: [],
  }

  return transitions[currentStatus]?.includes(targetStatus) ?? false
}

export function canCancel(status: SolicitacaoStatus): boolean {
  return status === 'pendente'
}

export function canApprove(status: SolicitacaoStatus): boolean {
  return status === 'pendente'
}

export function canReject(status: SolicitacaoStatus): boolean {
  return status === 'pendente'
}

export const statusLabels: Record<SolicitacaoStatus, string> = {
  pendente: 'Pendente',
  aprovada: 'Aprovada',
  reprovada: 'Reprovada',
  cancelada: 'Cancelada',
  expirada: 'Expirada',
}

export const statusColors: Record<SolicitacaoStatus, string> = {
  pendente: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  aprovada: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  reprovada: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  cancelada: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  expirada: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

export const statusIcons: Record<SolicitacaoStatus, string> = {
  pendente: 'clock',
  aprovada: 'check-circle',
  reprovada: 'x-circle',
  cancelada: 'slash',
  expirada: 'alert-triangle',
}
