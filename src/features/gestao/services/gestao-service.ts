import { GestaoRepository } from '../repositories/gestao-repository'
import type { GestaoData, GestaoFilters } from '../types'

export interface GestaoService {
  getData(filters?: GestaoFilters): Promise<GestaoData>
}

const repo = new GestaoRepository()

export const gestaoService: GestaoService = {
  async getData(filters = {}) {
    return repo.getData(filters)
  },
}
