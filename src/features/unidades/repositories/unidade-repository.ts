import type { SupabaseClient } from '@supabase/supabase-js'
import type { Unidade, CreateUnidadeInput, UpdateUnidadeInput } from '../types'

type Row = {
  id: string
  nome: string
  sigla: string | null
  endereco: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
}

function mapRow(row: Row): Unidade {
  return {
    id: row.id,
    nome: row.nome,
    sigla: row.sigla,
    endereco: row.endereco,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    deletedAt: row.deleted_at,
  }
}

export interface UnidadeRepository {
  listAll(showDeleted?: boolean): Promise<Unidade[]>
  getById(id: string): Promise<Unidade | null>
  create(input: CreateUnidadeInput, createdBy: string): Promise<Unidade>
  update(id: string, input: UpdateUnidadeInput, updatedBy: string): Promise<Unidade>
  softDelete(id: string, updatedBy: string): Promise<void>
  restore(id: string, updatedBy: string): Promise<void>
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>
  existsByNome(nome: string, excludeId?: string): Promise<boolean>
}

export function createUnidadeRepository(supabase: SupabaseClient): UnidadeRepository {
  return {
    async listAll(showDeleted = false) {
      let query = supabase
        .from('unidades')
        .select('*')
        .order('nome', { ascending: true })

      if (!showDeleted) {
        query = query.is('deleted_at', null)
      }

      const { data } = await query

      return ((data as Row[]) ?? []).map(mapRow)
    },

    async getById(id: string) {
      const { data } = await supabase
        .from('unidades')
        .select('*')
        .eq('id', id)
        .single()

      if (!data) return null
      return mapRow(data as Row)
    },

    async create(input: CreateUnidadeInput, createdBy: string) {
      const { data } = await supabase
        .from('unidades')
        .insert({
          nome: input.nome,
          sigla: input.sigla || null,
          endereco: input.endereco || null,
          created_by: createdBy,
          updated_by: createdBy,
        })
        .select()
        .single()

      if (!data) throw new Error('Erro ao criar unidade')
      return mapRow(data as Row)
    },

    async update(id: string, input: UpdateUnidadeInput, updatedBy: string) {
      const { data } = await supabase
        .from('unidades')
        .update({
          ...(input.nome !== undefined && { nome: input.nome }),
          ...(input.sigla !== undefined && { sigla: input.sigla || null }),
          ...(input.endereco !== undefined && { endereco: input.endereco || null }),
          ...(input.isActive !== undefined && { is_active: input.isActive }),
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (!data) throw new Error('Erro ao atualizar unidade')
      return mapRow(data as Row)
    },

    async softDelete(id: string, updatedBy: string) {
      const { error } = await supabase
        .from('unidades')
        .update({
          deleted_at: new Date().toISOString(),
          is_active: false,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao excluir unidade')
    },

    async restore(id: string, updatedBy: string) {
      const { error } = await supabase
        .from('unidades')
        .update({
          deleted_at: null,
          is_active: true,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao restaurar unidade')
    },

    async setActive(id: string, isActive: boolean, updatedBy: string) {
      const { error } = await supabase
        .from('unidades')
        .update({
          is_active: isActive,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao alterar status da unidade')
    },

    async existsByNome(nome: string, excludeId?: string) {
      let query = supabase
        .from('unidades')
        .select('id', { count: 'exact', head: true })
        .eq('nome', nome)
        .is('deleted_at', null)

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      const { count } = await query
      return (count ?? 0) > 0
    },
  }
}
