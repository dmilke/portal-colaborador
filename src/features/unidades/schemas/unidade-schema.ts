import { z } from 'zod'

export const unidadeSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome deve ter no mínimo 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  sigla: z
    .string()
    .max(20, 'A sigla deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  endereco: z
    .string()
    .max(500, 'O endereço deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
})

export const unidadeUpdateSchema = unidadeSchema.partial()

export type UnidadeFormData = z.infer<typeof unidadeSchema>
