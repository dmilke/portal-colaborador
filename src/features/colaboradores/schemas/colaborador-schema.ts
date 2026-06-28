import { z } from 'zod'
import { validateCPF } from '@/src/shared/lib/cpf'

const cpfSchema = z.string().refine((v) => {
  if (!v) return true
  return validateCPF(v)
}, 'CPF inválido')

const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/

export const colaboradorSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome deve ter no mínimo 2 caracteres')
    .max(255, 'O nome deve ter no máximo 255 caracteres'),
  matricula: z
    .string()
    .max(50, 'A matrícula deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  cpf: cpfSchema.optional().or(z.literal('')),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  telefone: z
    .string()
    .regex(phoneRegex, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  dataNascimento: z
    .string()
    .optional()
    .or(z.literal('')),
  dataAdmissao: z
    .string()
    .optional()
    .or(z.literal('')),
  genero: z
    .string()
    .max(20, 'Gênero deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  estadoCivil: z
    .string()
    .max(20, 'Estado civil deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  departamentoId: z.string().uuid('Departamento inválido').nullable().optional(),
  unidadeId: z.string().uuid('Unidade inválida').nullable().optional(),
  cargoId: z.string().uuid('Cargo inválido').nullable().optional(),
})

export const colaboradorUpdateSchema = colaboradorSchema.partial()

export type ColaboradorFormData = z.infer<typeof colaboradorSchema>
