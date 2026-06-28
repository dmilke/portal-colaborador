import 'server-only'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { createAuthRepository } from '@/src/features/auth/repositories/auth-repository'
import { createAuthService } from '@/src/features/auth/services/auth-service'
import type { ColaboradorSession } from '@/src/features/auth/types'

export const getCurrentColaborador = cache(async (): Promise<ColaboradorSession | null> => {
  const supabase = await createClient()
  const repository = createAuthRepository(supabase)
  const service = createAuthService(repository)

  return service.getCurrentColaborador()
})
