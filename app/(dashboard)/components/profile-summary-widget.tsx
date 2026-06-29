import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Building2, Briefcase, MapPin, Shield, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export async function ProfileSummaryWidget() {
  const colaborador = await getCurrentColaborador()

  if (!colaborador) return null

  const initials = colaborador.nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <User className="h-4 w-4" />
          Meu Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={colaborador.avatarUrl ?? undefined} alt={colaborador.nome} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{colaborador.nome}</h3>
            <p className="text-sm text-muted-foreground truncate">{colaborador.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {colaborador.departamentoNome && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{colaborador.departamentoNome}</span>
            </div>
          )}
          {colaborador.cargoNome && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{colaborador.cargoNome}</span>
            </div>
          )}
          {colaborador.unidadeNome && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{colaborador.unidadeNome}</span>
            </div>
          )}
          {colaborador.dataAdmissao && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{formatAdmissao(colaborador.dataAdmissao)}</span>
            </div>
          )}
        </div>

        {colaborador.roles.length > 0 && (
          <div className="flex items-start gap-2">
            <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {colaborador.roles.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatAdmissao(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ptBR })
  } catch {
    return dateStr
  }
}
