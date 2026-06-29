'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ColaboradorPerfil } from '../types'

interface ProfileWorkInfoProps {
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

export function ProfileWorkInfo({ perfil }: ProfileWorkInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Profissionais</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="Departamento" value={perfil.departamentoNome} />
        <InfoRow label="Cargo" value={perfil.cargoNome} />
        <InfoRow label="Unidade" value={perfil.unidadeNome} />
      </CardContent>
    </Card>
  )
}
