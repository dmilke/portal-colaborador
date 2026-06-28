export function validateDepartamentoNome(nome: string): string | null {
  if (!nome || nome.trim().length < 2) {
    return 'O nome deve ter no mínimo 2 caracteres'
  }
  if (nome.length > 100) {
    return 'O nome deve ter no máximo 100 caracteres'
  }
  return null
}
