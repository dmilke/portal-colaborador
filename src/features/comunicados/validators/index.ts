import type { ComunicadoPrioridade } from '../types'

export const prioridadeLabels: Record<ComunicadoPrioridade, string> = {
  baixa: 'Baixa',
  normal: 'Normal',
  media: 'Média',
  alta: 'Alta',
}

export const prioridadeColors: Record<ComunicadoPrioridade, string> = {
  baixa: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  media: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  alta: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}
