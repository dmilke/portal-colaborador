export interface Colaborador {
  id: string
  authUserId: string | null
  matricula: string | null
  nome: string
  cpf: string | null
  email: string | null
  telefone: string | null
  dataNascimento: string | null
  dataAdmissao: string | null
  avatarUrl: string | null
  genero: string | null
  estadoCivil: string | null
  departamentoId: string | null
  departamentoNome: string | null
  unidadeId: string | null
  unidadeNome: string | null
  cargoId: string | null
  cargoNome: string | null
  isActive: boolean
  roles: string[]
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export interface CreateColaboradorInput {
  nome: string
  dataNascimento?: string
  matricula?: string
  cpf?: string
  email?: string
  telefone?: string
  dataAdmissao?: string
  genero?: string
  estadoCivil?: string
  departamentoId: string | null
  unidadeId: string | null
  cargoId: string | null
}

export interface UpdateColaboradorInput {
  nome?: string
  dataNascimento?: string
  matricula?: string
  cpf?: string
  email?: string
  telefone?: string
  dataAdmissao?: string
  avatarUrl?: string
  genero?: string
  estadoCivil?: string
  departamentoId?: string | null
  unidadeId?: string | null
  cargoId?: string | null
  isActive?: boolean
}

export interface ColaboradorListParams {
  search?: string
  departamentoId?: string
  cargoId?: string
  unidadeId?: string
  status?: 'active' | 'inactive' | 'all'
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ColaboradorListResult {
  data: Colaborador[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface RoleAssignment {
  roleId: string
  roleNome: string
  assigned: boolean
}
