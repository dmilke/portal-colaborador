import type { SupabaseClient } from '@supabase/supabase-js'
import type { Configuracao, UpdateConfiguracaoInput } from '../types'
import { deriveCategory } from '../types'

type Row = {
  id: string
  chave: string
  valor: string
  tipo: string
  descricao: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

function mapRow(row: Row): Configuracao {
  return {
    id: row.id,
    chave: row.chave,
    valor: row.valor,
    tipo: row.tipo,
    descricao: row.descricao,
    categoria: deriveCategory(row.chave),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
  }
}

export interface ConfiguracaoRepository {
  listAll(): Promise<Configuracao[]>
  getByChave(chave: string): Promise<Configuracao | null>
  update(chave: string, input: UpdateConfiguracaoInput, updatedBy: string): Promise<Configuracao>
}

export function createConfiguracaoRepository(supabase: SupabaseClient): ConfiguracaoRepository {
  return {
    async listAll() {
      const { data } = await supabase
        .from('configuracoes')
        .select('*')
        .order('chave', { ascending: true })

      return ((data as Row[]) ?? []).map(mapRow)
    },

    async getByChave(chave) {
      const { data } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('chave', chave)
        .single()

      if (!data) return null
      return mapRow(data as Row)
    },

    async update(chave, input, updatedBy) {
      const { data } = await supabase
        .from('configuracoes')
        .update({
          valor: input.valor,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('chave', chave)
        .select()
        .single()

      if (!data) throw new Error('Erro ao atualizar configuracao')
      return mapRow(data as Row)
    },
  }
}
