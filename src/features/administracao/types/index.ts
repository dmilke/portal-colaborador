export interface ConfiguracaoSistema {
  id: string
  chave: string
  valor: string
  tipo: string
  descricao: string | null
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
}

export interface TipoFolga {
  id: string
  nome: string
  descricao: string | null
  requerAprovacao: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export interface DataBloqueada {
  id: string
  data: string
  motivo: string | null
  departamentoId: string | null
  unidadeId: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}
