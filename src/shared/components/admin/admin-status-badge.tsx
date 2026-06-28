import { Badge } from '@/components/ui/badge'

interface AdminStatusBadgeProps {
  isActive: boolean
  deletedAt?: string | null
}

export function AdminStatusBadge({ isActive, deletedAt }: AdminStatusBadgeProps) {
  if (deletedAt) {
    return <Badge variant="destructive">Excluído</Badge>
  }
  return isActive
    ? <Badge className="bg-emerald-600 hover:bg-emerald-600">Ativo</Badge>
    : <Badge variant="secondary">Inativo</Badge>
}
