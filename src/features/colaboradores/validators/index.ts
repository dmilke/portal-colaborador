import { validateCPF } from '@/src/shared/lib/cpf'

export function validateColaboradorData(data: {
  nome?: string
  cpf?: string
  matricula?: string
}): Record<string, string> {
  const errors: Record<string, string> = {}

  if (data.nome !== undefined && (data.nome.length < 2 || data.nome.length > 255)) {
    errors.nome = 'O nome deve ter entre 2 e 255 caracteres'
  }

  if (data.cpf && !validateCPF(data.cpf)) {
    errors.cpf = 'CPF inválido'
  }

  return errors
}
