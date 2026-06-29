import type { SupabaseClient } from '@supabase/supabase-js'
import type { DashboardStats, RecentActivityItem } from '../types'

export interface DashboardRepository {
  getStats(): Promise<DashboardStats>
  getRecentActivities(limit?: number): Promise<RecentActivityItem[]>
}

export function createDashboardRepository(supabase: SupabaseClient): DashboardRepository {
  return {
    async getStats() {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)

      const todayStartISO = todayStart.toISOString()
      const todayEndISO = todayEnd.toISOString()

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const [
        { count: totalColaboradores },
        { count: totalDepartamentos },
        { count: totalCargos },
        { count: totalUnidades },
        { count: totalTurnos },
        { count: solicitacoesPendentes },
        { count: solicitacoesAprovadasHoje },
        { count: solicitacoesReprovadasHoje },
        { count: comunicadosAtivos },
        { count: documentosAtivos },
        { count: documentosPublicados },
        { count: documentosRecentes },
      ] = await Promise.all([
        supabase.from('colaboradores').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('departamentos').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('cargos').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('unidades').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('turnos').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('solicitacoes').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
        supabase
          .from('solicitacoes')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'aprovada')
          .gte('created_at', todayStartISO)
          .lte('created_at', todayEndISO),
        supabase
          .from('solicitacoes')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'reprovada')
          .gte('created_at', todayStartISO)
          .lte('created_at', todayEndISO),
        supabase
          .from('comunicados')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .is('deleted_at', null),
        supabase
          .from('documentos')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .is('deleted_at', null),
        supabase
          .from('documentos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'publicado')
          .is('deleted_at', null),
        supabase
          .from('documentos')
          .select('*', { count: 'exact', head: true })
          .is('deleted_at', null)
          .gte('created_at', sevenDaysAgo.toISOString()),
      ])

      return {
        totalColaboradores: totalColaboradores ?? 0,
        totalDepartamentos: totalDepartamentos ?? 0,
        totalCargos: totalCargos ?? 0,
        totalUnidades: totalUnidades ?? 0,
        totalTurnos: totalTurnos ?? 0,
        solicitacoesPendentes: solicitacoesPendentes ?? 0,
        solicitacoesAprovadasHoje: solicitacoesAprovadasHoje ?? 0,
        solicitacoesReprovadasHoje: solicitacoesReprovadasHoje ?? 0,
        comunicadosAtivos: comunicadosAtivos ?? 0,
        documentosAtivos: documentosAtivos ?? 0,
        documentosPublicados: documentosPublicados ?? 0,
        documentosRecentes: documentosRecentes ?? 0,
      }
    },

    async getRecentActivities(limit = 10) {
      const { data } = await supabase
        .from('auditoria')
        .select(`
          id,
          acao,
          entidade_tipo,
          descricao,
          created_at,
          colaborador:colaboradores!auditoria_colaborador_id_fkey ( nome )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!data) return []

      return (data as unknown as {
        id: string
        acao: string
        entidade_tipo: string
        descricao: string | null
        created_at: string
        colaborador: { nome: string }[] | { nome: string } | null
      }[]).map((item) => ({
        id: item.id,
        acao: item.acao,
        entidadeTipo: item.entidade_tipo,
        descricao: item.descricao,
        createdAt: item.created_at,
        colaboradorNome: Array.isArray(item.colaborador)
          ? item.colaborador[0]?.nome ?? null
          : item.colaborador?.nome ?? null,
      }))
    },
  }
}
