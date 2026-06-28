import type { ColaboradorRepository } from '../repositories/colaborador-repository'
import type { Colaborador, CreateColaboradorInput, UpdateColaboradorInput, ColaboradorListParams, ColaboradorListResult } from '../types'
import { validateCPF } from '@/src/shared/lib/cpf'

export interface ColaboradorService {
  list(params?: ColaboradorListParams): Promise<ColaboradorListResult>
  listAll(): Promise<Colaborador[]>
  getById(id: string): Promise<Colaborador | null>
  create(input: CreateColaboradorInput, createdBy: string): Promise<Colaborador>
  update(id: string, input: UpdateColaboradorInput, updatedBy: string): Promise<Colaborador>
  softDelete(id: string, updatedBy: string): Promise<void>
  restore(id: string, updatedBy: string): Promise<void>
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>
  getRoles(colaboradorId: string): Promise<string[]>
  setRoles(colaboradorId: string, roleIds: string[]): Promise<void>
  getAllRoles(): Promise<{ id: string; nome: string; descricao: string | null }[]>
}

export function createColaboradorService(repository: ColaboradorRepository): ColaboradorService {
  return {
    async list(params) {
      return repository.list(params)
    },

    async listAll() {
      return repository.listAll()
    },

    async getById(id) {
      return repository.getById(id)
    },

    async create(input, createdBy) {
      const errors: string[] = []

      if (input.matricula) {
        const exists = await repository.existsByMatricula(input.matricula)
        if (exists) errors.push('Já existe um colaborador com esta matrícula')
      }

      if (input.cpf) {
        if (!validateCPF(input.cpf)) errors.push('CPF inválido')
        const exists = await repository.existsByCpf(input.cpf)
        if (exists) errors.push('Já existe um colaborador com este CPF')
      }

      if (input.email) {
        const exists = await repository.existsByEmail(input.email)
        if (exists) errors.push('Já existe um colaborador com este email')
      }

      if (errors.length > 0) throw new Error(errors.join('. '))

      return repository.create(input, createdBy)
    },

    async update(id, input, updatedBy) {
      const errors: string[] = []

      if (input.matricula) {
        const exists = await repository.existsByMatricula(input.matricula, id)
        if (exists) errors.push('Já existe um colaborador com esta matrícula')
      }

      if (input.cpf) {
        if (!validateCPF(input.cpf)) errors.push('CPF inválido')
        const exists = await repository.existsByCpf(input.cpf, id)
        if (exists) errors.push('Já existe um colaborador com este CPF')
      }

      if (input.email) {
        const exists = await repository.existsByEmail(input.email, id)
        if (exists) errors.push('Já existe um colaborador com este email')
      }

      if (errors.length > 0) throw new Error(errors.join('. '))

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

    async getRoles(colaboradorId) {
      return repository.getRoles(colaboradorId)
    },

    async setRoles(colaboradorId, roleIds) {
      await repository.setRoles(colaboradorId, roleIds)
    },

    async getAllRoles() {
      return repository.getAllRoles()
    },
  }
}
