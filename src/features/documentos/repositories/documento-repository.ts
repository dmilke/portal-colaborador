import { createClient } from '@/lib/supabase/server'
import type { Documento, DocumentoVersao, DocumentoLeitura, DocumentoStatus } from '../types'
import { getAudiencias, saveAudiencias as sharedSaveAudiencias } from '@/src/shared/lib/audiencia'
import type { AudienciaItem } from '@/src/shared/lib/audiencia'

type Row = Record<string, unknown> & {
  id: string
  titulo: string
  descricao: string | null
  tipo: string
  categoria: string | null
  status: string
  colaborador_id: string | null
  departamento_id: string | null
  unidade_id: string | null
  is_active: boolean
  publicacao_em: string | null
  expiracao_em: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
}

function mapRow(r: Row): Documento {
  return {
    id: r.id,
    titulo: r.titulo,
    descricao: r.descricao,
    tipo: r.tipo,
    categoria: r.categoria,
    status: r.status as DocumentoStatus,
    colaboradorId: r.colaborador_id,
    autorNome: null,
    departamentoId: r.departamento_id,
    unidadeId: r.unidade_id,
    isActive: r.is_active,
    publicacaoEm: r.publicacao_em,
    expiracaoEm: r.expiracao_em,
    audiencias: [],
    versaoAtual: 0,
    totalVersoes: 0,
    lido: false,
    lidoEm: null,
    downloadEm: null,
    totalLeitores: 0,
    anexos: [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    createdBy: r.created_by,
    updatedBy: r.updated_by,
    deletedAt: r.deleted_at,
  }
}

const DOCUMENTO_SELECT = `
  id,
  titulo,
  descricao,
  tipo,
  categoria,
  status,
  colaborador_id,
  departamento_id,
  unidade_id,
  is_active,
  publicacao_em,
  expiracao_em,
  created_at,
  updated_at,
  created_by,
  updated_by,
  deleted_at
`

export class DocumentoRepository {
  async count(): Promise<number> {
    const supabase = await createClient()
    const { count } = await supabase
      .from('documentos')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('is_active', true)
    return count ?? 0
  }

  async countPublished(): Promise<number> {
    const supabase = await createClient()
    const { count } = await supabase
      .from('documentos')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('status', 'publicado')
    return count ?? 0
  }

  async countPendingReads(colaboradorId: string): Promise<number> {
    const supabase = await createClient()
    const { count: total } = await supabase
      .from('documentos')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('status', 'publicado')
    const { count: lidos } = await supabase
      .from('documento_leitura')
      .select('documento_id', { count: 'exact', head: true })
      .eq('colaborador_id', colaboradorId)
    return Math.max(0, (total ?? 0) - (lidos ?? 0))
  }

  async countRecent(days = 7): Promise<number> {
    const supabase = await createClient()
    const since = new Date()
    since.setDate(since.getDate() - days)
    const { count } = await supabase
      .from('documentos')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null)
      .gte('created_at', since.toISOString())
    return count ?? 0
  }

  async findById(id: string): Promise<Documento | null> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('documentos')
      .select(DOCUMENTO_SELECT)
      .eq('id', id)
      .maybeSingle()
    return data ? mapRow(data as Row) : null
  }

  async findWithDetails(id: string, colaboradorId: string): Promise<Documento | null> {
    const supabase = await createClient()
    const { data: raw } = await supabase
      .from('documentos')
      .select(`${DOCUMENTO_SELECT}, autor:colaboradores!colaborador_id(nome)`)
      .eq('id', id)
      .maybeSingle()

    if (!raw) return null

    const item = mapRow(raw as Row)
    item.autorNome = (raw as Record<string, unknown>).autor
      ? ((raw as Record<string, unknown>).autor as Record<string, unknown>).nome as string
      : null

    const [audiencias, leitura, versaoAtual, totalVersoes, totalLeitores, anexos] = await Promise.all([
      getAudiencias('documento', id),
      supabase
        .from('documento_leitura')
        .select('lido_em, download_em')
        .eq('documento_id', id)
        .eq('colaborador_id', colaboradorId)
        .maybeSingle(),
      supabase
        .from('documento_versoes')
        .select('versao')
        .eq('documento_id', id)
        .eq('is_current', true)
        .maybeSingle(),
      supabase
        .from('documento_versoes')
        .select('id', { count: 'exact', head: true })
        .eq('documento_id', id),
      supabase
        .from('documento_leitura')
        .select('id', { count: 'exact', head: true })
        .eq('documento_id', id),
      supabase
        .from('anexos')
        .select('id, nome_arquivo, arquivo_url, bucket, mime_type, tamanho_bytes')
        .eq('entidade_tipo', 'documento')
        .eq('entidade_id', id),
    ])

    item.audiencias = audiencias
    item.lido = !!leitura?.data?.lido_em
    item.lidoEm = leitura?.data?.lido_em ?? null
    item.downloadEm = leitura?.data?.download_em ?? null
    item.versaoAtual = (versaoAtual?.data?.versao as number) ?? 0
    item.totalVersoes = totalVersoes.count ?? 0
    item.totalLeitores = totalLeitores.count ?? 0
    item.anexos = (anexos?.data ?? []).map((a: Record<string, unknown>) => ({
      id: a.id as string,
      nomeArquivo: a.nome_arquivo as string,
      arquivoUrl: a.arquivo_url as string,
      bucket: a.bucket as string,
      mimeType: a.mime_type as string | null,
      tamanhoBytes: a.tamanho_bytes as number | null,
    }))

    return item
  }

  async findAll(params: {
    search?: string
    status?: DocumentoStatus | 'all'
    tipo?: string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ data: Documento[]; total: number }> {
    const supabase = await createClient()
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('documentos')
      .select(DOCUMENTO_SELECT, { count: 'exact' })
      .is('deleted_at', null)

    if (params.status && params.status !== 'all') {
      query = query.eq('status', params.status)
    }

    if (params.search) {
      query = query.or(`titulo.ilike.%${params.search}%,descricao.ilike.%${params.search}%`)
    }
    if (params.tipo) {
      query = query.eq('tipo', params.tipo)
    }

    const sortBy = params.sortBy ?? 'created_at'
    const sortOrder = params.sortOrder ?? 'desc'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query = query.order(sortBy as any, { ascending: sortOrder === 'asc' })
      .range(from, to)

    const { data, count } = await query
    return {
      data: (data ?? []).map((r: unknown) => mapRow(r as Row)),
      total: count ?? 0,
    }
  }

  async create(data: {
    titulo: string
    descricao?: string | null
    tipo: string
    categoria?: string | null
    status: string
    colaboradorId?: string | null
    departamentoId?: string | null
    unidadeId?: string | null
    publicacaoEm?: string | null
    expiracaoEm?: string | null
    createdBy: string
  }): Promise<string> {
    const supabase = await createClient()
    const { data: inserted, error } = await supabase
      .from('documentos')
      .insert({
        titulo: data.titulo,
        descricao: data.descricao || null,
        tipo: data.tipo,
        categoria: data.categoria || null,
        status: data.status,
        colaborador_id: data.colaboradorId || null,
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

  async createInitialVersion(data: {
    documentoId: string
    titulo: string
    descricao?: string | null
    createdBy: string
  }): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('documento_versoes').insert({
      documento_id: data.documentoId,
      versao: 1,
      titulo: data.titulo,
      descricao: data.descricao || null,
      arquivo_url: '',
      bucket: 'documentos',
      is_current: true,
      created_by: data.createdBy,
    })
    if (error) throw error
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, data: Record<string, any>): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('documentos').update(data).eq('id', id)
    if (error) throw error
  }

  async createNewVersion(documentoId: string, data: {
    titulo?: string
    descricao?: string | null
    createdBy: string
  }): Promise<number> {
    const supabase = await createClient()
    const { data: current } = await supabase
      .from('documento_versoes')
      .select('versao')
      .eq('documento_id', documentoId)
      .order('versao', { ascending: false })
      .limit(1)
      .maybeSingle()

    const novaVersao = ((current as { versao: number } | null)?.versao ?? 0) + 1

    await supabase
      .from('documento_versoes')
      .update({ is_current: false })
      .eq('documento_id', documentoId)
      .eq('is_current', true)

    const { error } = await supabase.from('documento_versoes').insert({
      documento_id: documentoId,
      versao: novaVersao,
      titulo: data.titulo || null,
      descricao: data.descricao || null,
      arquivo_url: '',
      bucket: 'documentos',
      is_current: true,
      created_by: data.createdBy,
    })
    if (error) throw error

    return novaVersao
  }

  async getVersions(documentoId: string): Promise<DocumentoVersao[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('documento_versoes')
      .select(`
        id,
        documento_id,
        versao,
        titulo,
        descricao,
        arquivo_url,
        bucket,
        checksum,
        tamanho_bytes,
        mime_type,
        is_current,
        created_at,
        created_by,
        autor:colaboradores!created_by(nome)
      `)
      .eq('documento_id', documentoId)
      .order('versao', { ascending: false })

    return (data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      documentoId: r.documento_id as string,
      versao: r.versao as number,
      titulo: r.titulo as string | null,
      descricao: r.descricao as string | null,
      arquivoUrl: r.arquivo_url as string,
      bucket: r.bucket as string,
      checksum: r.checksum as string | null,
      tamanhoBytes: r.tamanho_bytes as number | null,
      mimeType: r.mime_type as string | null,
      isCurrent: r.is_current as boolean,
      createdAt: r.created_at as string,
      createdBy: r.created_by as string | null,
      autorNome: (r.autor as { nome: string } | null)?.nome ?? null,
    }))
  }

  async getVersion(id: string): Promise<DocumentoVersao | null> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('documento_versoes')
      .select(`
        id,
        documento_id,
        versao,
        titulo,
        descricao,
        arquivo_url,
        bucket,
        checksum,
        tamanho_bytes,
        mime_type,
        is_current,
        created_at,
        created_by
      `)
      .eq('id', id)
      .maybeSingle()

    if (!data) return null
    const r = data as Record<string, unknown>
    return {
      id: r.id as string,
      documentoId: r.documento_id as string,
      versao: r.versao as number,
      titulo: r.titulo as string | null,
      descricao: r.descricao as string | null,
      arquivoUrl: r.arquivo_url as string,
      bucket: r.bucket as string,
      checksum: r.checksum as string | null,
      tamanhoBytes: r.tamanho_bytes as number | null,
      mimeType: r.mime_type as string | null,
      isCurrent: r.is_current as boolean,
      createdAt: r.created_at as string,
      createdBy: r.created_by as string | null,
      autorNome: null,
    }
  }

  async saveAudiencias(documentoId: string, audiencias: { tipo: string; alvoId: string }[]): Promise<void> {
    await sharedSaveAudiencias(
      'documento',
      documentoId,
      audiencias.map(a => ({ tipo: a.tipo as AudienciaItem['tipo'], alvoId: a.alvoId }))
    )
  }

  async markAsRead(documentoId: string, colaboradorId: string): Promise<void> {
    const supabase = await createClient()
    await supabase.from('documento_leitura').upsert(
      {
        documento_id: documentoId,
        colaborador_id: colaboradorId,
        lido_em: new Date().toISOString(),
      },
      { onConflict: 'documento_id,colaborador_id' }
    )
  }

  async markAsDownloaded(documentoId: string, colaboradorId: string): Promise<void> {
    const supabase = await createClient()
    await supabase.from('documento_leitura').upsert(
      {
        documento_id: documentoId,
        colaborador_id: colaboradorId,
        download_em: new Date().toISOString(),
      },
      { onConflict: 'documento_id,colaborador_id' }
    )
  }

  async getLeitores(documentoId: string): Promise<DocumentoLeitura[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('documento_leitura')
      .select(`
        documento_id,
        colaborador_id,
        lido_em,
        download_em,
        colaborador:colaboradores!colaborador_id(nome)
      `)
      .eq('documento_id', documentoId)

    return (data ?? []).map((r: Record<string, unknown>) => ({
      documentoId: r.documento_id as string,
      colaboradorId: r.colaborador_id as string,
      lidoEm: r.lido_em as string,
      downloadEm: r.download_em as string | null,
      colaboradorNome: (r.colaborador as { nome: string } | null)?.nome ?? null,
    }))
  }

  async softDelete(id: string, userId: string): Promise<void> {
    const supabase = await createClient()
    await supabase
      .from('documentos')
      .update({ deleted_at: new Date().toISOString(), updated_by: userId })
      .eq('id', id)
  }

  async setActive(id: string, active: boolean, userId: string): Promise<void> {
    const supabase = await createClient()
    await supabase
      .from('documentos')
      .update({ is_active: active, updated_by: userId })
      .eq('id', id)
  }

  async setStatus(id: string, status: string, userId: string): Promise<void> {
    const supabase = await createClient()
    await supabase
      .from('documentos')
      .update({ status, updated_by: userId })
      .eq('id', id)
  }
}
