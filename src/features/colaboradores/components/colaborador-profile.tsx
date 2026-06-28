'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Mail, Calendar, Shield, Building, Briefcase, MapPin, User, ChevronLeft } from 'lucide-react'
import { formatCPF } from '@/src/shared/lib/cpf'
import type { Colaborador } from '../types'

interface ColaboradorProfileProps {
  colaborador: Colaborador
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | null }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="min-w-24">
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium">{value ?? '—'}</span>
    </div>
  )
}

export function ColaboradorProfile({ colaborador }: ColaboradorProfileProps) {
  const router = useRouter()
  const initials = colaborador.nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.push('/colaboradores')}>
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{colaborador.nome}</h2>
              <p className="text-sm text-muted-foreground">{colaborador.email ?? 'Sem email'}</p>
            </div>
            <Badge variant={colaborador.isActive ? 'default' : 'secondary'}>
              {colaborador.isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              <DetailRow icon={User} label="Nome" value={colaborador.nome} />
              <DetailRow icon={Mail} label="Email" value={colaborador.email} />
              <DetailRow icon={Calendar} label="Nascimento" value={colaborador.dataNascimento ? new Date(colaborador.dataNascimento).toLocaleDateString('pt-BR') : null} />
              <DetailRow icon={Calendar} label="Admissão" value={colaborador.dataAdmissao ? new Date(colaborador.dataAdmissao).toLocaleDateString('pt-BR') : null} />
              <DetailRow icon={Building} label="CPF" value={colaborador.cpf ? formatCPF(colaborador.cpf) : null} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Vínculos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              <DetailRow icon={Building} label="Departamento" value={colaborador.departamentoNome} />
              <DetailRow icon={Briefcase} label="Cargo" value={colaborador.cargoNome} />
              <DetailRow icon={MapPin} label="Unidade" value={colaborador.unidadeNome} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Funções</CardTitle>
            <CardDescription>
              {colaborador.roles.length} função(ões) atribuída(s)
              · {colaborador.authUserId ? 'Conta de acesso ativa' : 'Sem conta de acesso'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {colaborador.roles.length > 0
                ? colaborador.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-sm px-3 py-1">
                      <Shield className="h-3 w-3 mr-1" />
                      {role}
                    </Badge>
                  ))
                : <span className="text-sm text-muted-foreground">Nenhuma função atribuída</span>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
