export interface ColaboradorPerfil {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  avatarUrl: string | null
  dataNascimento: string | null
  genero: string | null
  estadoCivil: string | null
  departamentoNome: string | null
  cargoNome: string | null
  unidadeNome: string | null
  roles: string[]
}

export interface UpdatePerfilInput {
  nome?: string
  telefone?: string
  avatarUrl?: string
  dataNascimento?: string
  genero?: string
  estadoCivil?: string
}

export interface AlterarSenhaInput {
  senhaAtual: string
  novaSenha: string
}
