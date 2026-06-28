import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAuthRepository } from '@/src/features/auth/repositories/auth-repository'
import { createAuthService } from '@/src/features/auth/services/auth-service'
import type { ColaboradorSession } from '@/src/features/auth/types'
import type { User } from '@supabase/supabase-js'

export const verifySession = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return user as User
})

export const getCurrentColaborador = cache(async (): Promise<ColaboradorSession | null> => {
  const supabase = await createClient()
  const repository = createAuthRepository(supabase)
  const service = createAuthService(repository)

  return service.getCurrentColaborador()
})
