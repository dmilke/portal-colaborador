import { z } from 'zod'

export const turnoSchema = z.object({
  departamentoId: z
    .string()
    .min(1, 'Selecione um departamento'),
  nome: z
    .string()
    .min(2, 'O nome deve ter no minimo 2 caracteres')
    .max(100, 'O nome deve ter no maximo 100 caracteres'),
  descricao: z
    .string()
    .max(500, 'A descricao deve ter no maximo 500 caracteres')
    .optional()
    .or(z.literal('')),
})

export const turnoUpdateSchema = turnoSchema.partial()

export type TurnoFormData = z.infer<typeof turnoSchema>
