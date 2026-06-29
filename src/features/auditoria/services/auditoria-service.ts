import type { AuditoriaRepository } from '../repositories/auditoria-repository'
import type { Auditoria, AuditoriaFiltros } from '../types'

export interface AuditoriaService {
  list(filters: AuditoriaFiltros, page?: number, pageSize?: number): Promise<{ data: Auditoria[]; total: number }>
  getById(id: string): Promise<Auditoria | null>
  getColaboradores(): Promise<{ id: string; nome: string }[]>
  getEntidadeTipos(): Promise<string[]>
}

export function createAuditoriaService(repository: AuditoriaRepository): AuditoriaService {
  return {
    async list(filters, page, pageSize) {
      return repository.list(filters, page, pageSize)
    },

    async getById(id) {
      return repository.getById(id)
    },

    async getColaboradores() {
      return repository.getColaboradores()
    },

    async getEntidadeTipos() {
      return repository.getEntidadeTipos()
    },
  }
}
