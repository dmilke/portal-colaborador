'use client'

import { useActionState } from 'react'
import { Label } from '@/components/ui/label'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { loginAction } from '@/src/features/auth/actions/auth-actions'
import type { LoginState } from '@/src/features/auth/actions/auth-actions'

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, null)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <InputGroup className="w-full" aria-invalid={!!state?.errors?.email}>
          <InputGroupAddon align="inline-start">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            required
          />
        </InputGroup>
        {state?.errors?.email && (
          <p className="text-xs text-destructive">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <InputGroup className="w-full" aria-invalid={!!state?.errors?.password}>
          <InputGroupAddon align="inline-start">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </InputGroup>
        {state?.errors?.password && (
          <p className="text-xs text-destructive">{state.errors.password[0]}</p>
        )}
      </div>

      {state?.message && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Entrar
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Ao entrar, você concorda com os{' '}
        <Link href="#" className="underline underline-offset-2 hover:text-foreground">
          Termos de Uso
        </Link>{' '}
        e{' '}
        <Link href="#" className="underline underline-offset-2 hover:text-foreground">
          Política de Privacidade
        </Link>
        .
      </p>
    </form>
  )
}
