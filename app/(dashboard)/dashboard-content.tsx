'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Users,
  Clock,
  CalendarCheck,
  TrendingUp,
  FileText,
  Plus,
  ArrowRight,
  Bell,
} from 'lucide-react'

const stats = [
  {
    title: 'Colaboradores',
    value: '48',
    change: '+2 este mês',
    trend: 'up',
    icon: Users,
    variant: 'default' as const,
  },
  {
    title: 'Solicitações Pendentes',
    value: '12',
    change: '5 urgentes',
    trend: 'up',
    icon: Clock,
    variant: 'warning' as const,
  },
  {
    title: 'Folgas Aprovadas',
    value: '156',
    change: '+18% vs. mês passado',
    trend: 'up',
    icon: CalendarCheck,
    variant: 'default' as const,
  },
  {
    title: 'Documentos',
    value: '234',
    change: '8 expirando',
    trend: 'up',
    icon: FileText,
    variant: 'default' as const,
  },
]

const recentRequests = [
  {
    name: 'Maria Silva',
    department: 'Cuidado',
    type: 'Folga',
    status: 'Pendente',
    date: 'Hoje, 14:30',
    initials: 'MS',
  },
  {
    name: 'João Santos',
    department: 'Higienização',
    type: 'Folga',
    status: 'Aprovada',
    date: 'Hoje, 11:00',
    initials: 'JS',
  },
  {
    name: 'Ana Costa',
    department: 'Cuidado',
    type: 'Documento',
    status: 'Pendente',
    date: 'Ontem, 16:45',
    initials: 'AC',
  },
  {
    name: 'Pedro Oliveira',
    department: 'Higienização',
    type: 'Folga',
    status: 'Reprovada',
    date: 'Ontem, 09:20',
    initials: 'PO',
  },
  {
    name: 'Lucia Mendes',
    department: 'Cuidado',
    type: 'Documento',
    status: 'Aprovada',
    date: '2 dias atrás',
    initials: 'LM',
  },
]

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Pendente: 'secondary',
  Aprovada: 'default',
  Reprovada: 'destructive',
}

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visão geral do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Solicitação
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Solicitações Recentes</CardTitle>
              <CardDescription>Últimas solicitações registradas</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Ver todas
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="mb-4" />}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs bg-muted">
                        {request.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {request.name}
                        </span>
                        <Badge variant={statusVariant[request.status]}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {request.department} &middot; {request.type}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {request.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Próximas Ausências</CardTitle>
                <CardDescription>Folgas programadas</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Ver calendário
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Maria Silva', date: '01 Jul', department: 'Cuidado' },
                  { name: 'João Santos', date: '03-05 Jul', department: 'Higienização' },
                  { name: 'Ana Costa', date: '08 Jul', department: 'Cuidado' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs font-medium">
                      {item.date.split(' ')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.department}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {item.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Aniversariantes do Mês</CardTitle>
                <CardDescription>Colaboradores que fazem aniversário</CardDescription>
              </div>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Carlos Souza', date: '28 Jun', role: 'Cuidador' },
                  { name: 'Fernanda Lima', date: '30 Jun', role: 'Auxiliar' },
                  { name: 'Roberto Alves', date: '02 Jul', role: 'Enfermeiro' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {item.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
