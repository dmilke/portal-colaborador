import { z } from 'zod'
import { DOCUMENTO_TIPOS } from '../types'

const audienciaSchema = z.object({
  tipo: z.enum(['departamento', 'unidade', 'cargo', 'role', 'colaborador']),
  alvoId: z.string().uuid('ID inválido'),
})

export const documentoSchema = z.object({
  titulo: z
    .string()
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .max(255, 'O título deve ter no máximo 255 caracteres'),
  descricao: z
    .string()
    .optional()
    .or(z.literal('')),
  tipo: z.enum(DOCUMENTO_TIPOS as [string, ...string[]]),
  categoria: z
    .string()
    .max(50, 'Categoria deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  status: z.enum(['rascunho', 'publicado', 'arquivado', 'expirado']).default('rascunho'),
  publicacaoEm: z.string().nullable().optional(),
  expiracaoEm: z.string().nullable().optional(),
  audiencias: z.array(audienciaSchema).default([]),
})

export const documentoUpdateSchema = documentoSchema.partial()

export type DocumentoFormData = z.infer<typeof documentoSchema>
export type DocumentoUpdateFormData = z.infer<typeof documentoUpdateSchema>
