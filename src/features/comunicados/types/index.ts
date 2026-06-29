export interface Comunicado {
  id: string
  titulo: string
  conteudo: string
  autorId: string
  autorNome: string | null
  categoria: string | null
  prioridade: ComunicadoPrioridade
  isPinned: boolean
  departamentoId: string | null
  unidadeId: string | null
  publicacaoEm: string | null
  expiracaoEm: string | null
  isActive: boolean
  audiencias: ComunicadoAudiencia[]
  totalLeitores: number
  lido: boolean
  lidoEm: string | null
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export type ComunicadoPrioridade = 'baixa' | 'normal' | 'media' | 'alta'

import type { AudienciaItem } from '@/src/shared/lib/audiencia'
export type ComunicadoAudiencia = AudienciaItem

export interface CreateComunicadoInput {
  titulo: string
  conteudo: string
  categoria?: string
  prioridade: ComunicadoPrioridade
  isPinned: boolean
  departamentoId?: string | null
  unidadeId?: string | null
  publicacaoEm?: string | null
  expiracaoEm?: string | null
  audiencias: { tipo: ComunicadoAudiencia['tipo']; alvoId: string }[]
}

export interface UpdateComunicadoInput {
  titulo?: string
  conteudo?: string
  categoria?: string
  prioridade?: ComunicadoPrioridade
  isPinned?: boolean
  departamentoId?: string | null
  unidadeId?: string | null
  publicacaoEm?: string | null
  expiracaoEm?: string | null
  isActive?: boolean
  audiencias?: { tipo: ComunicadoAudiencia['tipo']; alvoId: string }[]
}

export interface ComunicadoLeitura {
  comunicadoId: string
  colaboradorId: string
  lidoEm: string
}

export interface ComunicadoAnexo {
  id: string
  nomeArquivo: string
  arquivoUrl: string
  bucket: string
  mimeType: string | null
  tamanhoBytes: number | null
}

export interface ComunicadoListParams {
  search?: string
  status?: 'active' | 'archived' | 'all'
  categoria?: string
  prioridade?: ComunicadoPrioridade
  dataInicio?: string
  dataFim?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ComunicadoListResult {
  data: Comunicado[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ComunicadoActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | null
