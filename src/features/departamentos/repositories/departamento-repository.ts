import type { SupabaseClient } from '@supabase/supabase-js'
import type { Departamento, CreateDepartamentoInput, UpdateDepartamentoInput } from '../types'

type Row = {
  id: string
  nome: string
  descricao: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
}

function mapRow(row: Row): Departamento {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    deletedAt: row.deleted_at,
  }
}

export interface DepartamentoRepository {
  listAll(showDeleted?: boolean): Promise<Departamento[]>
  getById(id: string): Promise<Departamento | null>
  create(input: CreateDepartamentoInput, createdBy: string): Promise<Departamento>
  update(id: string, input: UpdateDepartamentoInput, updatedBy: string): Promise<Departamento>
  softDelete(id: string, updatedBy: string): Promise<void>
  restore(id: string, updatedBy: string): Promise<void>
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>
  existsByNome(nome: string, excludeId?: string): Promise<boolean>
}

export function createDepartamentoRepository(supabase: SupabaseClient): DepartamentoRepository {
  return {
    async listAll(showDeleted = false) {
      let query = supabase
        .from('departamentos')
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
        .from('departamentos')
        .select('*')
        .eq('id', id)
        .single()

      if (!data) return null
      return mapRow(data as Row)
    },

    async create(input: CreateDepartamentoInput, createdBy: string) {
      const { data } = await supabase
        .from('departamentos')
        .insert({
          nome: input.nome,
          descricao: input.descricao || null,
          created_by: createdBy,
          updated_by: createdBy,
        })
        .select()
        .single()

      if (!data) throw new Error('Erro ao criar departamento')
      return mapRow(data as Row)
    },

    async update(id: string, input: UpdateDepartamentoInput, updatedBy: string) {
      const { data } = await supabase
        .from('departamentos')
        .update({
          ...(input.nome !== undefined && { nome: input.nome }),
          ...(input.descricao !== undefined && { descricao: input.descricao || null }),
          ...(input.isActive !== undefined && { is_active: input.isActive }),
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (!data) throw new Error('Erro ao atualizar departamento')
      return mapRow(data as Row)
    },

    async softDelete(id: string, updatedBy: string) {
      const { error } = await supabase
        .from('departamentos')
        .update({
          deleted_at: new Date().toISOString(),
          is_active: false,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao excluir departamento')
    },

    async restore(id: string, updatedBy: string) {
      const { error } = await supabase
        .from('departamentos')
        .update({
          deleted_at: null,
          is_active: true,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao restaurar departamento')
    },

    async setActive(id: string, isActive: boolean, updatedBy: string) {
      const { error } = await supabase
        .from('departamentos')
        .update({
          is_active: isActive,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao alterar status do departamento')
    },

    async existsByNome(nome: string, excludeId?: string) {
      let query = supabase
        .from('departamentos')
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
