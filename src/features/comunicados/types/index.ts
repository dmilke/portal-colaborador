export interface Comunicado {
  id: string
  titulo: string
  conteudo: string
  autorId: string
  departamentoId: string | null
  unidadeId: string | null
  publicacaoEm: string | null
  expiracaoEm: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export interface CreateComunicadoInput {
  titulo: string
  conteudo: string
  departamentoId?: string
  unidadeId?: string
  publicacaoEm?: string
  expiracaoEm?: string
}

export interface ComunicadoLeitura {
  comunicadoId: string
  colaboradorId: string
  lidoEm: string
}
