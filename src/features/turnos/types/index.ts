export interface Turno {
  id: string
  departamentoId: string
  departamentoNome: string | null
  nome: string
  descricao: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export interface CreateTurnoInput {
  departamentoId: string
  nome: string
  descricao?: string | null
}

export interface UpdateTurnoInput {
  departamentoId?: string
  nome?: string
  descricao?: string | null
  isActive?: boolean
}
