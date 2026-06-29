'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ColaboradorPerfil } from '../types'

interface ProfileDisplayProps {
  perfil: ColaboradorPerfil
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? '—'}</span>
    </div>
  )
}

function formatDate(date: string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function ProfileDisplay({ perfil }: ProfileDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="Nome Completo" value={perfil.nome} />
        <InfoRow label="E-mail" value={perfil.email} />
        <InfoRow label="Telefone" value={perfil.telefone} />
        <InfoRow label="Data de Nascimento" value={formatDate(perfil.dataNascimento)} />
        <InfoRow label="Gênero" value={perfil.genero} />
        <InfoRow label="Estado Civil" value={perfil.estadoCivil} />
      </CardContent>
    </Card>
  )
}
