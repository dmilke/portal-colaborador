import { z } from 'zod'

const today = new Date()
today.setHours(0, 0, 0, 0)

export const solicitacaoSchema = z.object({
  colaboradorId: z.string().uuid('Colaborador inválido'),
  tipoFolgaId: z.string().uuid('Tipo de folga inválido'),
  dataFolga: z.string().min(1, 'Data é obrigatória').refine(
    (val) => {
      const date = new Date(val)
      return date >= today
    },
    'Data deve ser hoje ou futura',
  ),
  turnoId: z.string().uuid('Turno inválido'),
  justificativa: z
    .string()
    .max(500, 'Justificativa deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
})

export const solicitacaoUpdateSchema = z.object({
  tipoFolgaId: z.string().uuid('Tipo de folga inválido').optional(),
  dataFolga: z
    .string()
    .min(1, 'Data é obrigatória')
    .refine(
      (val) => {
        const date = new Date(val)
        return date >= today
      },
      'Data deve ser hoje ou futura',
    )
    .optional(),
  turnoId: z.string().uuid('Turno inválido').optional(),
  justificativa: z
    .string()
    .max(500, 'Justificativa deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
  observacaoRh: z
    .string()
    .max(500, 'Observação deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
})

export const solicitacaoApproveSchema = z.object({
  id: z.string().uuid(),
})

export const solicitacaoRejectSchema = z.object({
  id: z.string().uuid(),
  motivo: z
    .string()
    .min(1, 'Motivo é obrigatório para reprovação')
    .max(500, 'Motivo deve ter no máximo 500 caracteres'),
})

export const solicitacaoCancelSchema = z.object({
  id: z.string().uuid(),
  motivo: z
    .string()
    .max(500, 'Motivo deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
})

export type SolicitacaoFormData = z.infer<typeof solicitacaoSchema>
export type SolicitacaoUpdateFormData = z.infer<typeof solicitacaoUpdateSchema>
