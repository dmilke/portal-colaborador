export interface Departamento {
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

export interface CreateDepartamentoInput {
  nome: string
  descricao?: string
}

export interface UpdateDepartamentoInput {
  nome?: string
  descricao?: string
  isActive?: boolean
}
