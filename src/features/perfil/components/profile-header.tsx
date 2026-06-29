'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { ColaboradorPerfil } from '../types'

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

interface ProfileHeaderProps {
  perfil: ColaboradorPerfil
}

export function ProfileHeader({ perfil }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <Avatar size="lg" className="h-20 w-20">
        {perfil.avatarUrl && <AvatarImage src={perfil.avatarUrl} alt={perfil.nome} />}
        <AvatarFallback className="text-lg">{getInitials(perfil.nome)}</AvatarFallback>
      </Avatar>
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold">{perfil.nome}</h1>
        <p className="text-muted-foreground">{perfil.cargoNome ?? 'Sem cargo'}</p>
        <div className="mt-1 flex flex-wrap justify-center gap-2 sm:justify-start">
          {perfil.roles.map((role) => (
            <span
              key={role}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
