import type { CargoRepository } from '../repositories/cargo-repository'
import type { Cargo, CreateCargoInput, UpdateCargoInput } from '../types'

export interface CargoService {
  list(showDeleted?: boolean): Promise<Cargo[]>
  getById(id: string): Promise<Cargo | null>
  create(input: CreateCargoInput, createdBy: string): Promise<Cargo>
  update(id: string, input: UpdateCargoInput, updatedBy: string): Promise<Cargo>
  softDelete(id: string, updatedBy: string): Promise<void>
  restore(id: string, updatedBy: string): Promise<void>
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>
}

export function createCargoService(repository: CargoRepository): CargoService {
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
        throw new Error('Já existe um cargo com este nome')
      }
      return repository.create(input, createdBy)
    },

    async update(id, input, updatedBy) {
      if (input.nome) {
        const exists = await repository.existsByNome(input.nome, id)
        if (exists) {
          throw new Error('Já existe um cargo com este nome')
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
