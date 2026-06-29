export type DocumentoStatus = 'rascunho' | 'publicado' | 'arquivado' | 'expirado' | 'pendente' | 'assinado' | 'cancelado'

export type DocumentoTipo =
  | 'Regulamentos'
  | 'Políticas'
  | 'Procedimentos'
  | 'Formulários'
  | 'Comunicados Oficiais'
  | 'Contratos'
  | 'Termos'
  | 'Outros'

export interface Documento {
  id: string
  titulo: string
  descricao: string | null
  tipo: string
  categoria: string | null
  status: DocumentoStatus
  colaboradorId: string | null
  autorNome: string | null
  departamentoId: string | null
  unidadeId: string | null
  isActive: boolean
  publicacaoEm: string | null
  expiracaoEm: string | null
  audiencias: import('@/src/shared/lib/audiencia').AudienciaItem[]
  versaoAtual: number
  totalVersoes: number
  lido: boolean
  lidoEm: string | null
  downloadEm: string | null
  totalLeitores: number
  anexos: DocumentoAnexo[]
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export interface DocumentoVersao {
  id: string
  documentoId: string
  versao: number
  titulo: string | null
  descricao: string | null
  arquivoUrl: string
  bucket: string
  checksum: string | null
  tamanhoBytes: number | null
  mimeType: string | null
  isCurrent: boolean
  createdAt: string
  createdBy: string | null
  autorNome: string | null
}

export interface DocumentoLeitura {
  documentoId: string
  colaboradorId: string
  lidoEm: string
  downloadEm: string | null
  colaboradorNome: string | null
}

export interface DocumentoAnexo {
  id: string
  nomeArquivo: string
  arquivoUrl: string
  bucket: string
  mimeType: string | null
  tamanhoBytes: number | null
}

export interface CreateDocumentoInput {
  titulo: string
  descricao?: string
  tipo: string
  categoria?: string
  status?: DocumentoStatus
  colaboradorId?: string | null
  departamentoId?: string | null
  unidadeId?: string | null
  publicacaoEm?: string | null
  expiracaoEm?: string | null
  audiencias: { tipo: string; alvoId: string }[]
}

export interface UpdateDocumentoInput {
  titulo?: string
  descricao?: string
  tipo?: string
  categoria?: string
  status?: DocumentoStatus
  colaboradorId?: string | null
  departamentoId?: string | null
  unidadeId?: string | null
  publicacaoEm?: string | null
  expiracaoEm?: string | null
  isActive?: boolean
  audiencias?: { tipo: string; alvoId: string }[]
}

export interface DocumentoListParams {
  search?: string
  status?: DocumentoStatus | 'all'
  tipo?: string
  dataInicio?: string
  dataFim?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DocumentoListResult {
  data: Documento[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type DocumentoActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | null

export const DOCUMENTO_TIPOS: DocumentoTipo[] = [
  'Regulamentos',
  'Políticas',
  'Procedimentos',
  'Formulários',
  'Comunicados Oficiais',
  'Contratos',
  'Termos',
  'Outros',
]
