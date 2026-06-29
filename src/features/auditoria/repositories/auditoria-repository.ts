import type { SupabaseClient } from '@supabase/supabase-js'
import type { Auditoria, AuditoriaFiltros } from '../types'

type Row = Record<string, unknown> & {
  id: string
  colaborador_id: string | null
  acao: string
  entidade_tipo: string
  entidade_id: string | null
  descricao: string | null
  valor_anterior: unknown
  valor_novo: unknown
  request_id: string | null
  user_agent: string | null
  ip_address: string | null
  created_at: string
  colaborador?: { nome: string }[] | { nome: string } | null
}

function extractNome(val: { nome: string }[] | { nome: string } | null): string | null {
  if (!val) return null
  if (Array.isArray(val)) return val[0]?.nome ?? null
  return val.nome
}

function mapRow(row: Row): Auditoria {
  return {
    id: row.id,
    colaboradorId: row.colaborador_id,
    acao: row.acao as Auditoria['acao'],
    entidadeTipo: row.entidade_tipo,
    entidadeId: row.entidade_id,
    descricao: row.descricao,
    valorAnterior: row.valor_anterior,
    valorNovo: row.valor_novo,
    requestId: row.request_id,
    userAgent: row.user_agent,
    ipAddress: row.ip_address,
    createdAt: row.created_at,
    colaboradorNome: extractNome(row.colaborador ?? null),
  }
}

export interface AuditoriaRepository {
  list(filters: AuditoriaFiltros, page?: number, pageSize?: number): Promise<{ data: Auditoria[]; total: number }>
  getById(id: string): Promise<Auditoria | null>
  getColaboradores(): Promise<{ id: string; nome: string }[]>
  getEntidadeTipos(): Promise<string[]>
}

export function createAuditoriaRepository(supabase: SupabaseClient): AuditoriaRepository {
  return {
    async list(filters, page = 0, pageSize = 20) {
      let query = supabase
        .from('auditoria')
        .select(`
          *,
          colaborador:colaboradores!auditoria_colaborador_id_fkey ( nome )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })

      if (filters.dataInicio) {
        query = query.gte('created_at', filters.dataInicio)
      }
      if (filters.dataFim) {
        query = query.lte('created_at', filters.dataFim + 'T23:59:59')
      }
      if (filters.colaboradorId) {
        query = query.eq('colaborador_id', filters.colaboradorId)
      }
      if (filters.acao) {
        query = query.eq('acao', filters.acao)
      }
      if (filters.entidadeTipo) {
        query = query.eq('entidade_tipo', filters.entidadeTipo)
      }
      if (filters.entidadeId) {
        query = query.eq('entidade_id', filters.entidadeId)
      }

      const from = page * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, count } = await query

      return {
        data: ((data as Row[]) ?? []).map(mapRow),
        total: count ?? 0,
      }
    },

    async getById(id) {
      const { data } = await supabase
        .from('auditoria')
        .select(`
          *,
          colaborador:colaboradores!auditoria_colaborador_id_fkey ( nome )
        `)
        .eq('id', id)
        .single()

      if (!data) return null
      return mapRow(data as Row)
    },

    async getColaboradores() {
      const { data } = await supabase
        .from('colaboradores')
        .select('id, nome')
        .is('deleted_at', null)
        .order('nome', { ascending: true })

      return (data ?? []) as { id: string; nome: string }[]
    },

    async getEntidadeTipos() {
      const { data } = await supabase
        .from('auditoria')
        .select('entidade_tipo')
        .order('entidade_tipo', { ascending: true })

      if (!data) return []
      return [...new Set((data as { entidade_tipo: string }[]).map((r) => r.entidade_tipo))]
    },
  }
}
