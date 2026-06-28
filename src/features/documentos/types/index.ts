export type DocumentStatus = 'pendente' | 'assinado' | 'cancelado'
export type SignatureType = 'eletronica' | 'digital'

export interface Documento {
  id: string
  titulo: string
  descricao: string | null
  tipo: string
  status: DocumentStatus
  colaboradorId: string | null
  departamentoId: string | null
  unidadeId: string | null
  isActive: boolean
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
  arquivoUrl: string
  bucket: string
  checksum: string | null
  tamanhoBytes: number | null
  mimeType: string | null
  createdAt: string
  createdBy: string | null
}

export interface DocumentoAssinatura {
  id: string
  documentoId: string
  colaboradorId: string
  tipo: SignatureType
  assinadoEm: string
  createdAt: string
}

export interface CreateDocumentoInput {
  titulo: string
  descricao?: string
  tipo: string
  colaboradorId?: string
  departamentoId?: string
  unidadeId?: string
}
