import type { DepartamentoRepository } from '../repositories/departamento-repository'
import type { Departamento, CreateDepartamentoInput, UpdateDepartamentoInput } from '../types'

export interface DepartamentoService {
  list(showDeleted?: boolean): Promise<Departamento[]>
  getById(id: string): Promise<Departamento | null>
  create(input: CreateDepartamentoInput, createdBy: string): Promise<Departamento>
  update(id: string, input: UpdateDepartamentoInput, updatedBy: string): Promise<Departamento>
  softDelete(id: string, updatedBy: string): Promise<void>
  restore(id: string, updatedBy: string): Promise<void>
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>
}

export function createDepartamentoService(repository: DepartamentoRepository): DepartamentoService {
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
        throw new Error('Já existe um departamento com este nome')
      }

      return repository.create(input, createdBy)
    },

    async update(id, input, updatedBy) {
      if (input.nome) {
        const exists = await repository.existsByNome(input.nome, id)
        if (exists) {
          throw new Error('Já existe um departamento com este nome')
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
