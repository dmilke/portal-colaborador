import { PerfilRepository } from '../repositories/perfil-repository'
import type { ColaboradorPerfil, UpdatePerfilInput } from '../types'
import { getCurrentColaborador } from '@/src/shared/lib/auth'

export interface PerfilService {
  getPerfil(): Promise<ColaboradorPerfil | null>
  updatePerfil(input: UpdatePerfilInput): Promise<void>
}

const repo = new PerfilRepository()

export const perfilService: PerfilService = {
  async getPerfil() {
    const session = await getCurrentColaborador()
    if (!session) return null
    return repo.getCurrentUser(session.authUserId)
  },

  async updatePerfil(input) {
    const session = await getCurrentColaborador()
    if (!session) throw new Error('Usuário não autenticado')

    const colaboradorId = await repo.getColaboradorId(session.authUserId)
    if (!colaboradorId) throw new Error('Colaborador não encontrado')

    await repo.updateProfile(colaboradorId, input, session.id)
  },
}
