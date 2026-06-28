import { getCurrentColaborador } from './auth'

export async function checkPermission(permission: string): Promise<{ allowed: boolean; error?: string; colaboradorId?: string }> {
  const colaborador = await getCurrentColaborador()
  if (!colaborador) return { allowed: false, error: 'Usuário não autenticado' }
  if (!colaborador.permissions.includes(permission)) return { allowed: false, error: 'Permissão negada' }
  return { allowed: true, colaboradorId: colaborador.id }
}
