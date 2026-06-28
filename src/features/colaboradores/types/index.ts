export interface Collaborator {
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
  unidadeId: string | null
  cargoId: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export interface CreateCollaboratorInput {
  nome: string
  dataNascimento?: string
  matricula?: string
  cpf?: string
  email?: string
  telefone?: string
  dataAdmissao?: string
  genero?: string
  estadoCivil?: string
  departamentoId: string
  unidadeId: string
  cargoId: string
}

export interface UpdateCollaboratorInput {
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
  departamentoId?: string
  unidadeId?: string
  cargoId?: string
  isActive?: boolean
}
