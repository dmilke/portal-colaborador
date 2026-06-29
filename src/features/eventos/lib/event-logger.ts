import { createAdminClient } from '@/lib/supabase/admin'
import type { DomainEvent } from '../types'

export async function logEventToDatabase(event: DomainEvent, status: string, executionMs?: number, errorMessage?: string): Promise<void> {
  try {
    const admin = await createAdminClient()
    await admin.from('event_log').insert({
      event_type: event.type,
      origin: event.origin,
      payload: event.payload ? JSON.parse(JSON.stringify(event.payload)) : null,
      colaborador_id: event.colaboradorId ?? null,
      status,
      execution_ms: executionMs ?? null,
      error_message: errorMessage ?? null,
    })
  } catch (err) {
    console.error('[EventEngine] Failed to log event:', err)
  }
}
