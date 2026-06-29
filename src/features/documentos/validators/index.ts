export const statusLabels: Record<string, string> = {
  rascunho: 'Rascunho',
  publicado: 'Publicado',
  arquivado: 'Arquivado',
  expirado: 'Expirado',
  pendente: 'Pendente',
  assinado: 'Assinado',
  cancelado: 'Cancelado',
}

export const statusColors: Record<string, string> = {
  rascunho: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  publicado: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  arquivado: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  expirado: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  pendente: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  assinado: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelado: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}
