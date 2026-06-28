export interface Unidade {
  id: string
  nome: string
  sigla: string | null
  endereco: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export interface CreateUnidadeInput {
  nome: string
  sigla?: string
  endereco?: string
}

export interface UpdateUnidadeInput {
  nome?: string
  sigla?: string
  endereco?: string
  isActive?: boolean
}
