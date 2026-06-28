export interface Cargo {
  id: string
  nome: string
  descricao: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export interface CreateCargoInput {
  nome: string
  descricao?: string
}

export interface UpdateCargoInput {
  nome?: string
  descricao?: string
  isActive?: boolean
}
