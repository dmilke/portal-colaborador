export function DocumentoTypeBadge({ tipo }: { tipo: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-400/20">
      {tipo}
    </span>
  )
}
