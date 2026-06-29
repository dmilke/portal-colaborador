import { createClient } from '@/lib/supabase/server'
import type {
  GestaoFilters,
  GestaoData,
  CollaboratorStats,
  SolicitacaoStats,
  ComunicadoStats,
  DocumentoStats,
  NotificacaoStats,
  OperationalIndicators,
} from '../types'

export class GestaoRepository {
  async getData(filters: GestaoFilters): Promise<GestaoData> {
    const [collaborators, solicitacoes, comunicados, documentos, notificacoes, operational] =
      await Promise.all([
        this.getCollaboratorStats(filters),
        this.getSolicitacaoStats(filters),
        this.getComunicadoStats(filters),
        this.getDocumentoStats(filters),
        this.getNotificacaoStats(),
        this.getOperationalIndicators(),
      ])

    return { collaborators, solicitacoes, comunicados, documentos, notificacoes, operational }
  }

  private async getCollaboratorStats(filters: GestaoFilters): Promise<CollaboratorStats> {
    const supabase = await createClient()

    let query = supabase.from('colaboradores').select('id, is_active, deleted_at', { count: 'exact' })
    if (filters.departamentoId) query = query.eq('departamento_id', filters.departamentoId)
    if (filters.unidadeId) query = query.eq('unidade_id', filters.unidadeId)
    if (filters.cargoId) query = query.eq('cargo_id', filters.cargoId)
    query = query.is('deleted_at', null)

    const { data, count } = await query
    const total = count ?? 0
    const active = (data ?? []).filter((c) => c.is_active).length
    const inactive = total - active

    const { count: lastLogin } = await supabase
      .from('auditoria')
      .select('id', { count: 'exact', head: true })
      .eq('acao', 'login')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    const neverLogged = Math.max(0, total - (lastLogin ?? 0))

    return { total, active, inactive, lastLogin: lastLogin ?? 0, neverLogged }
  }

  private async getSolicitacaoStats(filters: GestaoFilters): Promise<SolicitacaoStats> {
    const supabase = await createClient()

    let baseQuery = supabase.from('solicitacoes').select('id, status, created_at, aprovado_em', { count: 'exact' })
    baseQuery = baseQuery.is('deleted_at', null)
    if (filters.dateFrom) baseQuery = baseQuery.gte('created_at', filters.dateFrom)
    if (filters.dateTo) baseQuery = baseQuery.lte('created_at', filters.dateTo)

    const { data: all } = await baseQuery

    const rows = all ?? []
    const pending = rows.filter((r) => r.status === 'pendente').length
    const approved = rows.filter((r) => r.status === 'aprovada').length
    const rejected = rows.filter((r) => r.status === 'reprovada').length
    const cancelled = rows.filter((r) => r.status === 'cancelada').length

    const approvalTimes = rows
      .filter((r) => r.status === 'aprovada' && r.aprovado_em && r.created_at)
      .map((r) => (new Date(r.aprovado_em).getTime() - new Date(r.created_at).getTime()) / (1000 * 60 * 60))
    const avgApprovalHours = approvalTimes.length > 0
      ? Math.round(approvalTimes.reduce((a, b) => a + b, 0) / approvalTimes.length * 10) / 10
      : null

    const [byDeptResult, byUnitResult] = await Promise.all([
      supabase.from('solicitacoes').select(`
        id,
        colaborador:colaboradores!colaborador_id(departamento:departamentos!departamento_id(nome))
      `).is('deleted_at', null),
      supabase.from('solicitacoes').select(`
        id,
        colaborador:colaboradores!colaborador_id(unidade:unidades!unidade_id(nome))
      `).is('deleted_at', null),
    ])

    const byDepartment = aggregateByField(byDeptResult.data ?? [], 'colaborador', 'departamento', 'nome')
    const byUnit = aggregateByField(byUnitResult.data ?? [], 'colaborador', 'unidade', 'nome')

    const { data: monthlyData } = await supabase
      .from('solicitacoes')
      .select('created_at')
      .is('deleted_at', null)
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())

    const monthly = aggregateMonthly((monthlyData ?? []).map((r) => r.created_at))

    return { pending, approved, rejected, cancelled, avgApprovalHours, byDepartment, byUnit, monthly }
  }

  private async getComunicadoStats(filters: GestaoFilters): Promise<ComunicadoStats> {
    const supabase = await createClient()

    let comQuery = supabase.from('comunicados').select('id, titulo, is_active', { count: 'exact' })
    comQuery = comQuery.is('deleted_at', null)
    if (filters.departamentoId) comQuery = comQuery.eq('departamento_id', filters.departamentoId)
    if (filters.unidadeId) comQuery = comQuery.eq('unidade_id', filters.unidadeId)

    const { data: comunicados, count: published } = await comQuery

    const { count: totalLeituras } = await supabase
      .from('comunicado_leitura')
      .select('id', { count: 'exact', head: true })

    const totalColabs = (await supabase.from('colaboradores').select('id', { count: 'exact', head: true }).is('deleted_at', null)).count ?? 1
    const readRate = published && published > 0 ? Math.round((totalLeituras ?? 0) / (published * totalColabs) * 100) : 0

    const { data: leituraData } = await supabase
      .from('comunicado_leitura')
      .select('comunicado_id')

    const leituraCountMap = new Map<string, number>()
    for (const l of (leituraData ?? []) as { comunicado_id: string }[]) {
      leituraCountMap.set(l.comunicado_id, (leituraCountMap.get(l.comunicado_id) ?? 0) + 1)
    }

    const withCounts = (comunicados ?? []).map((c) => ({
      titulo: c.titulo,
      leitores: leituraCountMap.get(c.id) ?? 0,
    }))
    withCounts.sort((a, b) => b.leitores - a.leitores)

    const { data: monthlyData } = await supabase
      .from('comunicados')
      .select('created_at')
      .is('deleted_at', null)
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())

    return {
      published: published ?? 0,
      unread: Math.max(0, (published ?? 0) - (totalLeituras ?? 0)),
      readRate,
      topViewed: withCounts.slice(0, 5),
      leastViewed: withCounts.slice(-5).reverse(),
      monthly: aggregateMonthly((monthlyData ?? []).map((r) => r.created_at)),
    }
  }

  private async getDocumentoStats(filters: GestaoFilters): Promise<DocumentoStats> {
    const supabase = await createClient()

    let docQuery = supabase.from('documentos').select('id, titulo, status', { count: 'exact' })
    docQuery = docQuery.is('deleted_at', null)
    if (filters.departamentoId) docQuery = docQuery.eq('departamento_id', filters.departamentoId)
    if (filters.unidadeId) docQuery = docQuery.eq('unidade_id', filters.unidadeId)

    const { data: documentos, count: published } = await docQuery

    const { count: totalDocLeituras } = await supabase
      .from('documento_leitura')
      .select('id', { count: 'exact', head: true })

    const { count: totalDownloads } = await supabase
      .from('documento_leitura')
      .select('id', { count: 'exact', head: true })
      .not('download_em', 'is', null)

    const totalColabs = (await supabase.from('colaboradores').select('id', { count: 'exact', head: true }).is('deleted_at', null)).count ?? 1
    const readRate = published && published > 0 ? Math.round((totalDocLeituras ?? 0) / (published * totalColabs) * 100) : 0

    const { data: docLeituraData } = await supabase
      .from('documento_leitura')
      .select('documento_id')

    const docLeituraCountMap = new Map<string, number>()
    for (const l of (docLeituraData ?? []) as { documento_id: string }[]) {
      docLeituraCountMap.set(l.documento_id, (docLeituraCountMap.get(l.documento_id) ?? 0) + 1)
    }

    const withCounts = (documentos ?? []).map((d) => ({
      titulo: d.titulo,
      leitores: docLeituraCountMap.get(d.id) ?? 0,
    }))
    withCounts.sort((a, b) => b.leitores - a.leitores)

    const { data: monthlyData } = await supabase
      .from('documentos')
      .select('created_at')
      .is('deleted_at', null)
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())

    return {
      published: published ?? 0,
      pendingReading: Math.max(0, (published ?? 0) - (totalDocLeituras ?? 0)),
      readRate,
      downloads: totalDownloads ?? 0,
      mostAccessed: withCounts.slice(0, 5),
      leastAccessed: withCounts.slice(-5).reverse(),
      monthly: aggregateMonthly((monthlyData ?? []).map((r) => r.created_at)),
    }
  }

  private async getNotificacaoStats(): Promise<NotificacaoStats> {
    const supabase = await createClient()

    const { count: unread } = await supabase
      .from('notificacoes')
      .select('id', { count: 'exact', head: true })
      .eq('lida', false)
      .is('deleted_at', null)

    const { count: read } = await supabase
      .from('notificacoes')
      .select('id', { count: 'exact', head: true })
      .eq('lida', true)
      .is('deleted_at', null)

    const { data: allNotifs } = await supabase
      .from('notificacoes')
      .select('tipo')
      .is('deleted_at', null)

    const tipoMap = new Map<string, number>()
    for (const n of (allNotifs ?? []) as { tipo: string | null }[]) {
      const tipo = n.tipo ?? 'outro'
      tipoMap.set(tipo, (tipoMap.get(tipo) ?? 0) + 1)
    }
    const byType = Array.from(tipoMap.entries()).map(([tipo, count]) => ({ tipo, count }))

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: recent } = await supabase
      .from('notificacoes')
      .select('created_at')
      .is('deleted_at', null)
      .gte('created_at', thirtyDaysAgo)

    const last30Days = aggregateDaily((recent ?? []).map((r) => r.created_at), 30)

    return { unread: unread ?? 0, read: read ?? 0, byType, last30Days }
  }

  private async getOperationalIndicators(): Promise<OperationalIndicators> {
    const supabase = await createClient()

    const [
      { count: pendingActions },
      { count: expiredDocuments },
      { count: expiredCommunications },
      { count: requestsAwaitingApproval },
    ] = await Promise.all([
      supabase.from('solicitacoes').select('id', { count: 'exact', head: true }).eq('status', 'pendente').is('deleted_at', null),
      supabase.from('documentos').select('id', { count: 'exact', head: true }).eq('status', 'expirado').is('deleted_at', null),
      supabase.from('comunicados').select('id', { count: 'exact', head: true }).is('deleted_at', null).eq('is_active', false),
      supabase.from('solicitacoes').select('id', { count: 'exact', head: true }).eq('status', 'pendente').is('deleted_at', null),
    ])

    const { count: todayLogins } = await supabase
      .from('auditoria')
      .select('id', { count: 'exact', head: true })
      .eq('acao', 'login')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    return {
      usersOnline: todayLogins ?? 0,
      pendingActions: pendingActions ?? 0,
      expiredDocuments: expiredDocuments ?? 0,
      expiredCommunications: expiredCommunications ?? 0,
      requestsAwaitingApproval: requestsAwaitingApproval ?? 0,
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function aggregateByField(data: any[], mainField: string, subField: string, valueField: string): { name: string; count: number }[] {
  const map = new Map<string, number>()
  for (const row of data) {
    const nested = row[mainField]
    if (!nested) continue
    const sub = Array.isArray(nested) ? nested[0]?.[subField] : nested[subField]
    if (!sub) continue
    const name = Array.isArray(sub) ? sub[0]?.[valueField] : sub[valueField]
    if (name) map.set(name, (map.get(name) ?? 0) + 1)
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}

function aggregateMonthly(dates: string[]): { month: string; count: number }[] {
  const map = new Map<string, number>()
  for (const d of dates) {
    try {
      const dt = new Date(d)
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
      map.set(key, (map.get(key) ?? 0) + 1)
    } catch { /* skip */ }
  }
  return Array.from(map.entries()).map(([month, count]) => ({ month, count })).sort((a, b) => a.month.localeCompare(b.month))
}

function aggregateDaily(dates: string[], days: number): { date: string; count: number }[] {
  const map = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    map.set(key, 0)
  }
  for (const d of dates) {
    try {
      const key = new Date(d).toISOString().split('T')[0]
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1)
    } catch { /* skip */ }
  }
  return Array.from(map.entries()).map(([date, count]) => ({ date, count }))
}
