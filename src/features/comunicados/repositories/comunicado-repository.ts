import { createClient } from '@/lib/supabase/server'
import type { Comunicado, ComunicadoPrioridade } from '../types'
import { getAudiencias, saveAudiencias as sharedSaveAudiencias } from '@/src/shared/lib/audiencia'
import type { AudienciaItem } from '@/src/shared/lib/audiencia'

type Row = Record<string, unknown> & {
  id: string
  titulo: string
  conteudo: string
  autor_id: string
  categoria: string | null
  prioridade: ComunicadoPrioridade
  is_pinned: boolean
  departamento_id: string | null
  unidade_id: string | null
  publicacao_em: string | null
  expiracao_em: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
}

type ComunicadoRaw = Row & {
  autor?: { nome: string } | null
}

export type ComunicadoAudiencia = AudienciaItem

function mapRow(r: Row): Comunicado {
  return {
    id: r.id,
    titulo: r.titulo,
    conteudo: r.conteudo,
    autorId: r.autor_id,
    autorNome: null,
    categoria: r.categoria,
    prioridade: r.prioridade,
    isPinned: r.is_pinned,
    departamentoId: r.departamento_id,
    unidadeId: r.unidade_id,
    publicacaoEm: r.publicacao_em,
    expiracaoEm: r.expiracao_em,
    isActive: r.is_active,
    audiencias: [],
    totalLeitores: 0,
    lido: false,
    lidoEm: null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    createdBy: r.created_by,
    updatedBy: r.updated_by,
    deletedAt: r.deleted_at,
  }
}

const COMUNICADO_SELECT = `
  id,
  titulo,
  conteudo,
  autor_id,
  categoria,
  prioridade,
  is_pinned,
  departamento_id,
  unidade_id,
  publicacao_em,
  expiracao_em,
  is_active,
  created_at,
  updated_at,
  created_by,
  updated_by,
  deleted_at
`

export class ComunicadoRepository {
  async count(): Promise<number> {
    const supabase = await createClient()
    const { count } = await supabase
      .from('comunicados')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null)
      .is('is_active', true)
    return count ?? 0
  }

  async countUnread(colaboradorId: string): Promise<number> {
    const supabase = await createClient()
    const [total, leituras] = await Promise.all([
      supabase
        .from('comunicados')
        .select('id', { count: 'exact', head: true })
        .is('deleted_at', null)
        .is('is_active', true),
      supabase
        .from('comunicado_leitura')
        .select('comunicado_id', { count: 'exact', head: true })
        .eq('colaborador_id', colaboradorId),
    ])
    const totalComunicados = total.count ?? 0
    const totalLidos = leituras.count ?? 0
    return Math.max(0, totalComunicados - totalLidos)
  }

  async findById(id: string): Promise<Comunicado | null> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('comunicados')
      .select(COMUNICADO_SELECT)
      .eq('id', id)
      .maybeSingle()
    return data ? mapRow(data as Row) : null
  }

  async findWithDetails(id: string, colaboradorId: string): Promise<Comunicado | null> {
    const supabase = await createClient()
    const { data: raw } = await supabase
      .from('comunicados')
      .select(`${COMUNICADO_SELECT}, autor:colaboradores!autor_id(nome)`)
      .eq('id', id)
      .maybeSingle()

    if (!raw) return null

    const item = mapRow(raw as unknown as Row)
    item.autorNome = (raw as unknown as ComunicadoRaw).autor?.nome ?? null

    const [audiencias, leitura] = await Promise.all([
      this.findAudiencias(id),
      supabase
        .from('comunicado_leitura')
        .select('lido_em')
        .eq('comunicado_id', id)
        .eq('colaborador_id', colaboradorId)
        .maybeSingle(),
    ])

    item.audiencias = audiencias
    item.lido = !!leitura?.data?.lido_em
    item.lidoEm = leitura?.data?.lido_em ?? null
    item.totalLeitores = await this.countLeitores(id)

    return item
  }

  async findAll(params: {
    search?: string
    status?: 'active' | 'archived' | 'all'
    categoria?: string
    prioridade?: ComunicadoPrioridade
    colaboradorId?: string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ data: Comunicado[]; total: number }> {
    const supabase = await createClient()
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('comunicados')
      .select(COMUNICADO_SELECT, { count: 'exact' })

    if (params.status === 'active' || !params.status) {
      query = query.is('deleted_at', null).eq('is_active', true)
    } else if (params.status === 'archived') {
      query = query.is('deleted_at', null).eq('is_active', false)
    } else {
      query = query.is('deleted_at', null)
    }

    if (params.search) {
      query = query.or(`titulo.ilike.%${params.search}%,conteudo.ilike.%${params.search}%`)
    }
    if (params.categoria) {
      query = query.eq('categoria', params.categoria)
    }
    if (params.prioridade) {
      query = query.eq('prioridade', params.prioridade)
    }

    const sortBy = params.sortBy ?? 'created_at'
    const sortOrder = params.sortOrder ?? 'desc'
    query = query.order('is_pinned', { ascending: false })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .order(sortBy as any, { ascending: sortOrder === 'asc' })
      .range(from, to)

    const { data, count } = await query
    const total = count ?? 0

    const items = (data ?? []).map((r: unknown) => mapRow(r as Row))

    return { data: items, total }
  }

  async findAudiencias(comunicadoId: string): Promise<ComunicadoAudiencia[]> {
    return getAudiencias('comunicado', comunicadoId)
  }

  async create(data: {
    titulo: string
    conteudo: string
    autorId: string
    categoria?: string | null
    prioridade: ComunicadoPrioridade
    isPinned: boolean
    departamentoId?: string | null
    unidadeId?: string | null
    publicacaoEm?: string | null
    expiracaoEm?: string | null
    createdBy: string
  }): Promise<string> {
    const supabase = await createClient()
    const { data: inserted, error } = await supabase
      .from('comunicados')
      .insert({
        titulo: data.titulo,
        conteudo: data.conteudo,
        autor_id: data.autorId,
        categoria: data.categoria || null,
        prioridade: data.prioridade,
        is_pinned: data.isPinned,
        departamento_id: data.departamentoId || null,
        unidade_id: data.unidadeId || null,
        publicacao_em: data.publicacaoEm || null,
        expiracao_em: data.expiracaoEm || null,
        created_by: data.createdBy,
        updated_by: data.createdBy,
      })
      .select('id')
      .single()
    if (error) throw error
    return inserted.id
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, data: Record<string, any>): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('comunicados').update(data).eq('id', id)
    if (error) throw error
  }

  async softDelete(id: string, userId: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('comunicados')
      .update({ deleted_at: new Date().toISOString(), updated_by: userId })
      .eq('id', id)
    if (error) throw error
  }

  async setActive(id: string, active: boolean, userId: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('comunicados')
      .update({ is_active: active, updated_by: userId })
      .eq('id', id)
    if (error) throw error
  }

  async saveAudiencias(comunicadoId: string, audiencias: { tipo: string; alvoId: string }[]): Promise<void> {
    await sharedSaveAudiencias(
      'comunicado',
      comunicadoId,
      audiencias.map(a => ({ tipo: a.tipo as AudienciaItem['tipo'], alvoId: a.alvoId }))
    )
  }

  async markAsRead(comunicadoId: string, colaboradorId: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('comunicado_leitura').upsert(
      {
        comunicado_id: comunicadoId,
        colaborador_id: colaboradorId,
        lido_em: new Date().toISOString(),
      },
      { onConflict: 'comunicado_id,colaborador_id' }
    )
    if (error) throw error
  }

  async countLeitores(comunicadoId: string): Promise<number> {
    const supabase = await createClient()
    const { count } = await supabase
      .from('comunicado_leitura')
      .select('id', { count: 'exact', head: true })
      .eq('comunicado_id', comunicadoId)
    return count ?? 0
  }


}
