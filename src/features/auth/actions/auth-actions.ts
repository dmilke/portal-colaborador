'use server'

import { createClient } from '@/lib/supabase/server'
import { createAuthRepository } from '../repositories/auth-repository'
import { createAuthService } from '../services/auth-service'
import { loginSchema } from '../schemas'
import { redirect } from 'next/navigation'
import { dispatch, emit, initializeEventHandlers } from '@/src/features/eventos'

initializeEventHandlers()

export type LoginState = {
  errors: Record<string, string[]> | null
  message: string | null
} | null

export async function loginAction(prevState: LoginState, formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validated = loginSchema.safeParse(raw)
  if (!validated.success) {
    const errors = validated.error.flatten().fieldErrors
    return { errors, message: null }
  }

  const supabase = await createClient()
  const repository = createAuthRepository(supabase)
  const service = createAuthService(repository)

  const { session, error } = await service.login(
    validated.data.email,
    validated.data.password,
  )

  if (error || !session) {
    return { errors: null, message: error?.message ?? 'Erro ao fazer login' }
  }

  await dispatch(emit('login', 'auth', { userId: session.user.id, email: session.user.email }, session.colaboradorId ?? undefined))

  redirect('/')
}

export async function logoutAction() {
  const supabase = await createClient()
  const repository = createAuthRepository(supabase)
  const service = createAuthService(repository)

  const { data: { user } } = await supabase.auth.getUser()

  await dispatch(emit('logout', 'auth', { userId: user?.id ?? '' }))

  await service.logout()
  redirect('/login')
}
