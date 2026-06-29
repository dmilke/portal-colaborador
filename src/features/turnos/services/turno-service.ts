import type { TurnoRepository } from '../repositories/turno-repository'
import type { Turno, CreateTurnoInput, UpdateTurnoInput } from '../types'

export interface TurnoService {
  list(showDeleted?: boolean): Promise<Turno[]>
  getById(id: string): Promise<Turno | null>
  create(input: CreateTurnoInput, createdBy: string): Promise<Turno>
  update(id: string, input: UpdateTurnoInput, updatedBy: string): Promise<Turno>
  softDelete(id: string, updatedBy: string): Promise<void>
  restore(id: string, updatedBy: string): Promise<void>
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>
}

export function createTurnoService(repository: TurnoRepository): TurnoService {
  return {
    async list(showDeleted = false) {
      return repository.listAll(showDeleted)
    },

    async getById(id) {
      return repository.getById(id)
    },

    async create(input, createdBy) {
      const exists = await repository.existsByDepartamentoNome(input.departamentoId, input.nome)
      if (exists) {
        throw new Error('Ja existe um turno com este nome neste departamento')
      }
      return repository.create(input, createdBy)
    },

    async update(id, input, updatedBy) {
      if (input.nome !== undefined || input.departamentoId !== undefined) {
        const current = await repository.getById(id)
        if (current) {
          const deptId = input.departamentoId ?? current.departamentoId
          const nome = input.nome ?? current.nome
          const exists = await repository.existsByDepartamentoNome(deptId, nome, id)
          if (exists) {
            throw new Error('Ja existe um turno com este nome neste departamento')
          }
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
