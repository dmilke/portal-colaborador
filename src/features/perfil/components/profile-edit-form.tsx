'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updatePerfilAction } from '../actions/perfil-actions'
import type { ColaboradorPerfil } from '../types'
import type { ProfileActionState } from '../actions/perfil-actions'

interface ProfileEditFormProps {
  perfil: ColaboradorPerfil
}

const generoOptions = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Feminino', label: 'Feminino' },
  { value: 'Outro', label: 'Outro' },
  { value: 'Prefiro não informar', label: 'Prefiro não informar' },
]

const estadoCivilOptions = [
  { value: 'Solteiro(a)', label: 'Solteiro(a)' },
  { value: 'Casado(a)', label: 'Casado(a)' },
  { value: 'Divorciado(a)', label: 'Divorciado(a)' },
  { value: 'Viúvo(a)', label: 'Viúvo(a)' },
  { value: 'União estável', label: 'União estável' },
]

export function ProfileEditForm({ perfil }: ProfileEditFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(updatePerfilAction, null satisfies ProfileActionState)

  if (state?.success) {
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className="text-sm font-medium">Nome Completo</label>
            <Input id="nome" name="nome" defaultValue={perfil.nome} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="telefone" className="text-sm font-medium">Telefone</label>
            <Input id="telefone" name="telefone" defaultValue={perfil.telefone ?? ''} placeholder="(00) 00000-0000" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dataNascimento" className="text-sm font-medium">Data de Nascimento</label>
            <Input id="dataNascimento" name="dataNascimento" type="date" defaultValue={perfil.dataNascimento ?? ''} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="genero" className="text-sm font-medium">Gênero</label>
            <select name="genero" defaultValue={perfil.genero ?? ''} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option value="">Selecione</option>
              {generoOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="estadoCivil" className="text-sm font-medium">Estado Civil</label>
            <select name="estadoCivil" defaultValue={perfil.estadoCivil ?? ''} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option value="">Selecione</option>
              {estadoCivilOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="avatarUrl" className="text-sm font-medium">URL do Avatar</label>
            <Input id="avatarUrl" name="avatarUrl" type="url" defaultValue={perfil.avatarUrl ?? ''} placeholder="https://..." />
          </div>

          {state?.message && (
            <div className={`sm:col-span-2 text-sm ${state.success ? 'text-green-600' : 'text-destructive'}`}>
              {state.message}
            </div>
          )}

          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => router.refresh()}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
