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
  descricao?: string | null
}

export interface UpdateDepartamentoInput {
  nome?: string
  descricao?: string | null
  isActive?: boolean
}

export interface DepartamentoListParams {
  search?: string
  page: number
  pageSize: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  showInactive?: boolean
  showDeleted?: boolean
}

export interface DepartamentoListResult {
  data: Departamento[]
  total: number
}
