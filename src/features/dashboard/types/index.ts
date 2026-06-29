export interface DashboardStats {
  totalColaboradores: number
  totalDepartamentos: number
  totalCargos: number
  totalUnidades: number
  totalTurnos: number
  solicitacoesPendentes: number
  solicitacoesAprovadasHoje: number
  solicitacoesReprovadasHoje: number
  comunicadosAtivos: number
  documentosAtivos: number
  documentosPublicados: number
  documentosRecentes: number
}

export interface RecentActivityItem {
  id: string
  colaboradorNome: string | null
  acao: string
  entidadeTipo: string
  descricao: string | null
  createdAt: string
}
