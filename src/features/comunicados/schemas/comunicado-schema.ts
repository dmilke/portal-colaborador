import { z } from 'zod'

const audienciaSchema = z.object({
  tipo: z.enum(['departamento', 'unidade', 'cargo', 'role', 'colaborador']),
  alvoId: z.string().uuid('ID inválido'),
})

export const comunicadoSchema = z.object({
  titulo: z
    .string()
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .max(255, 'O título deve ter no máximo 255 caracteres'),
  conteudo: z
    .string()
    .min(1, 'O conteúdo é obrigatório'),
  categoria: z
    .string()
    .max(50, 'Categoria deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  prioridade: z.enum(['baixa', 'normal', 'media', 'alta']),
  isPinned: z.boolean().default(false),
  departamentoId: z.string().uuid('Departamento inválido').nullable().optional(),
  unidadeId: z.string().uuid('Unidade inválida').nullable().optional(),
  publicacaoEm: z.string().nullable().optional(),
  expiracaoEm: z.string().nullable().optional(),
  audiencias: z.array(audienciaSchema).default([]),
})

export const comunicadoUpdateSchema = comunicadoSchema.partial()

export type ComunicadoFormData = z.infer<typeof comunicadoSchema>
export type ComunicadoUpdateFormData = z.infer<typeof comunicadoUpdateSchema>
