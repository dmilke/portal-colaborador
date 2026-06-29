import type { DocumentoStatus } from '../types'
import { statusLabels, statusColors } from '../validators'

export function DocumentoStatusBadge({ status }: { status: DocumentoStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || statusColors.rascunho}`}>
      {statusLabels[status] || status}
    </span>
  )
}
