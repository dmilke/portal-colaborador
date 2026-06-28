export interface LoginInput {
  email: string
  password: string
}

export interface AuthSession {
  user: {
    id: string
    email: string
  }
  colaboradorId: string | null
  roles: string[]
}

export interface ColaboradorSession {
  id: string
  authUserId: string
  nome: string
  email: string | null
  avatarUrl: string | null
  departamentoId: string | null
  departamentoNome: string | null
  cargoId: string | null
  cargoNome: string | null
  unidadeId: string | null
  unidadeNome: string | null
  roles: string[]
  permissions: string[]
}

export interface AuthError {
  message: string
  code?: string
}
