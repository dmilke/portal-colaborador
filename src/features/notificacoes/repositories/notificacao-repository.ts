import { createClient } from '@/lib/supabase/server'
import type { Notificacao } from '../types'

type Row = Record<string, unknown> & {
  id: string
  colaborador_id: string
  solicitacao_id: string | null
  titulo: string
  mensagem: string
  tipo: string | null
  payload: Record<string, unknown> | null
  lida: boolean
  lida_em: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
}

function mapRow(r: Row): Notificacao {
  return {
    id: r.id,
    colaboradorId: r.colaborador_id,
    solicitacaoId: r.solicitacao_id,
    titulo: r.titulo,
    mensagem: r.mensagem,
    tipo: r.tipo,
    payload: r.payload,
    lida: r.lida,
    lidaEm: r.lida_em,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    createdBy: r.created_by,
    updatedBy: r.updated_by,
    deletedAt: r.deleted_at,
  }
}

export interface NotificacaoListParams {
  colaboradorId: string
  lida?: boolean
  tipo?: string
  page?: number
  pageSize?: number
}

export interface NotificacaoListResult {
  data: Notificacao[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export class NotificacaoRepository {
  async countUnread(colaboradorId: string): Promise<number> {
    const supabase = await createClient()
    const { count } = await supabase
      .from('notificacoes')
      .select('id', { count: 'exact', head: true })
      .eq('colaborador_id', colaboradorId)
      .eq('lida', false)
      .is('deleted_at', null)
    return count ?? 0
  }

  async findAll(params: NotificacaoListParams): Promise<NotificacaoListResult> {
    const supabase = await createClient()
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('notificacoes')
      .select('*', { count: 'exact' })
      .eq('colaborador_id', params.colaboradorId)
      .is('deleted_at', null)

    if (params.lida !== undefined) {
      query = query.eq('lida', params.lida)
    }
    if (params.tipo) {
      query = query.eq('tipo', params.tipo)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(from, to)

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

  async findRecent(colaboradorId: string, limit = 5): Promise<Notificacao[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit)

    return (data ?? []).map((r: unknown) => mapRow(r as Row))
  }

  async markAsRead(id: string, colaboradorId: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('notificacoes')
      .update({ lida: true, lida_em: new Date().toISOString() })
      .eq('id', id)
      .eq('colaborador_id', colaboradorId)
    if (error) throw error
  }

  async markAllAsRead(colaboradorId: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('notificacoes')
      .update({ lida: true, lida_em: new Date().toISOString() })
      .eq('colaborador_id', colaboradorId)
      .eq('lida', false)
      .is('deleted_at', null)
    if (error) throw error
  }
}
