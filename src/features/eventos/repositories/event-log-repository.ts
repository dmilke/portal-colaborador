import { createClient } from '@/lib/supabase/server'
import type { EventLogEntry, EventLogListResult, EventStats } from '../types'

type Row = Record<string, unknown> & {
  id: string
  event_type: string
  origin: string
  payload: Record<string, unknown> | null
  colaborador_id: string | null
  status: string
  execution_ms: number | null
  error_message: string | null
  created_at: string
}

function mapRow(r: Row): EventLogEntry {
  return {
    id: r.id,
    eventType: r.event_type,
    origin: r.origin,
    payload: r.payload,
    colaboradorId: r.colaborador_id,
    colaboradorNome: null,
    status: r.status,
    executionMs: r.execution_ms,
    errorMessage: r.error_message,
    createdAt: r.created_at,
  }
}

export class EventLogRepository {
  async list(params: {
    eventType?: string
    status?: string
    page?: number
    pageSize?: number
  }): Promise<EventLogListResult> {
    const supabase = await createClient()
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 20
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('event_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (params.eventType) query = query.eq('event_type', params.eventType)
    if (params.status) query = query.eq('status', params.status)

    query = query.range(from, to)

    const { data, count } = await query
    const total = count ?? 0

    return {
      data: (data ?? []).map((r: unknown) => mapRow(r as Row)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  async getStats(): Promise<EventStats> {
    const supabase = await createClient()

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const [
      { count: totalProcessed },
      { count: totalFailed },
      { count: last24h },
    ] = await Promise.all([
      supabase.from('event_log').select('id', { count: 'exact', head: true }).eq('status', 'processed'),
      supabase.from('event_log').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
      supabase.from('event_log').select('id', { count: 'exact', head: true }).gte('created_at', twentyFourHoursAgo),
    ])

    const { data: allEvents } = await supabase
      .from('event_log')
      .select('event_type')

    const typeMap = new Map<string, number>()
    for (const e of (allEvents ?? []) as { event_type: string }[]) {
      typeMap.set(e.event_type, (typeMap.get(e.event_type) ?? 0) + 1)
    }
    const byType = Array.from(typeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    const { data: recent } = await supabase
      .from('event_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    return {
      totalProcessed: totalProcessed ?? 0,
      totalFailed: totalFailed ?? 0,
      last24h: last24h ?? 0,
      byType,
      recent: (recent ?? []).map((r: unknown) => mapRow(r as Row)),
    }
  }
}
