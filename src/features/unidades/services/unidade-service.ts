import type { UnidadeRepository } from '../repositories/unidade-repository'
import type { Unidade, CreateUnidadeInput, UpdateUnidadeInput } from '../types'

export interface UnidadeService {
  list(showDeleted?: boolean): Promise<Unidade[]>
  getById(id: string): Promise<Unidade | null>
  create(input: CreateUnidadeInput, createdBy: string): Promise<Unidade>
  update(id: string, input: UpdateUnidadeInput, updatedBy: string): Promise<Unidade>
  softDelete(id: string, updatedBy: string): Promise<void>
  restore(id: string, updatedBy: string): Promise<void>
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>
}

export function createUnidadeService(repository: UnidadeRepository): UnidadeService {
  return {
    async list(showDeleted = false) {
      return repository.listAll(showDeleted)
    },

    async getById(id) {
      return repository.getById(id)
    },

    async create(input, createdBy) {
      const exists = await repository.existsByNome(input.nome)
      if (exists) {
        throw new Error('Já existe uma unidade com este nome')
      }
      return repository.create(input, createdBy)
    },

    async update(id, input, updatedBy) {
      if (input.nome) {
        const exists = await repository.existsByNome(input.nome, id)
        if (exists) {
          throw new Error('Já existe uma unidade com este nome')
        }
      }
      return repository.update(id, input, updatedBy)
    },

    async softDelete(id, updatedBy) {
      await repository.softDelete(id, updatedBy)
    },

    async restore(id, updatedBy) {
      await repository.restore(id, updatedBy)
    },

    async setActive(id, isActive, updatedBy) {
      await repository.setActive(id, isActive, updatedBy)
    },
  }
}
