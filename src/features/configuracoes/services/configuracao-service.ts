import type { ConfiguracaoRepository } from '../repositories/configuracao-repository'
import type { Configuracao, ConfiguracaoCategoria, UpdateConfiguracaoInput } from '../types'
import { categoriaLabels } from '../types'

export interface ConfiguracaoService {
  list(): Promise<Configuracao[]>
  listGrouped(): Promise<ConfiguracaoCategoria[]>
  getByChave(chave: string): Promise<Configuracao | null>
  update(chave: string, input: UpdateConfiguracaoInput, updatedBy: string): Promise<Configuracao>
}

export function createConfiguracaoService(repository: ConfiguracaoRepository): ConfiguracaoService {
  return {
    async list() {
      return repository.listAll()
    },

    async listGrouped() {
      const all = await repository.listAll()
      const groups: Record<string, Configuracao[]> = {}

      for (const c of all) {
        const cat = c.categoria
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(c)
      }

      const orderedKeys = ['geral', 'sistema', 'notificacoes', 'portal']
      const result: ConfiguracaoCategoria[] = []

      for (const key of orderedKeys) {
        if (groups[key]) {
          result.push({ key, label: categoriaLabels[key] ?? key, settings: groups[key] })
        }
      }

      for (const key of Object.keys(groups)) {
        if (!orderedKeys.includes(key)) {
          result.push({ key, label: categoriaLabels[key] ?? key, settings: groups[key] })
        }
      }

      return result
    },

    async getByChave(chave) {
      return repository.getByChave(chave)
    },

    async update(chave, input, updatedBy) {
      if (input.valor.trim() === '') {
        throw new Error('O valor nao pode ser vazio')
      }

      const current = await repository.getByChave(chave)
      if (!current) throw new Error('Configuracao nao encontrada')

      if (current.tipo === 'integer') {
        const num = Number(input.valor)
        if (Number.isNaN(num) || !Number.isInteger(num)) {
          throw new Error('O valor deve ser um numero inteiro')
        }
      }

      return repository.update(chave, input, updatedBy)
    },
  }
}
