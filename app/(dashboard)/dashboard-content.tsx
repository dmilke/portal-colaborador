'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ColaboradorSession } from '@/src/features/auth/types'

interface DashboardContentProps {
  colaborador: ColaboradorSession
  user: {
    id: string
    email?: string
    lastSignInAt?: string | null
    createdAt?: string
  }
}

export function DashboardContent({ colaborador, user }: DashboardContentProps) {
  const initials = colaborador.nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const lastLogin =
    user.lastSignInAt
      ? formatDistanceToNow(new Date(user.lastSignInAt), {
          addSuffix: true,
          locale: ptBR,
        })
      : 'Primeiro acesso'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bem-vindo, {colaborador.nome.split(' ')[0]}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {colaborador.departamentoNome ?? 'Não definido'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cargo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {colaborador.cargoNome ?? 'Não definido'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {colaborador.unidadeNome ?? 'Não definido'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Último acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{lastLogin}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informações do Colaborador</CardTitle>
            <CardDescription>Dados da sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-sm font-medium">{colaborador.nome}</p>
                  <p className="text-xs text-muted-foreground">{colaborador.email}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Departamento:</span>
                    <p className="font-medium">{colaborador.departamentoNome ?? '—'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cargo:</span>
                    <p className="font-medium">{colaborador.cargoNome ?? '—'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Unidade:</span>
                    <p className="font-medium">{colaborador.unidadeNome ?? '—'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data de admissão:</span>
                    <p className="font-medium">
                      {colaborador.dataAdmissao
                        ? new Date(colaborador.dataAdmissao).toLocaleDateString('pt-BR')
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Permissões</CardTitle>
            <CardDescription>
              {colaborador.permissions.length} permissões concedidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Roles
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {colaborador.roles.length > 0 ? (
                    colaborador.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Nenhum role atribuído</span>
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Permissões ({colaborador.permissions.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {colaborador.permissions.length > 0 ? (
                    colaborador.permissions.map((perm) => (
                      <Badge key={perm} variant="outline" className="text-xs">
                        {perm}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Nenhuma permissão</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
