'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { changePasswordAction } from '../actions/perfil-actions'
import type { ProfileActionState } from '../actions/perfil-actions'

export function PasswordChangeForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(changePasswordAction, null satisfies ProfileActionState)

  if (state?.success) {
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="currentPassword" className="text-sm font-medium">Senha Atual</label>
            <Input id="currentPassword" name="currentPassword" type="password" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="newPassword" className="text-sm font-medium">Nova Senha</label>
            <Input id="newPassword" name="newPassword" type="password" required minLength={6} />
            <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Nova Senha</label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
          </div>

          {state?.message && (
            <div className={`sm:col-span-2 text-sm ${state.success ? 'text-green-600' : 'text-destructive'}`}>
              {state.message}
            </div>
          )}

          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => router.refresh()}>Cancelar</Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
