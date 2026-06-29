import type { ComunicadoPrioridade } from '../types'
import { prioridadeLabels, prioridadeColors } from '../validators'

export function ComunicadoPriorityBadge({ prioridade }: { prioridade: ComunicadoPrioridade }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${prioridadeColors[prioridade]}`}>
      {prioridadeLabels[prioridade]}
    </span>
  )
}