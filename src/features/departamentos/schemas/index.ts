import { z } from 'zod'

export const departamentoSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome deve ter no mínimo 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  descricao: z
    .string()
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
})

export const departamentoUpdateSchema = departamentoSchema.partial()

export type DepartamentoFormData = z.infer<typeof departamentoSchema>
