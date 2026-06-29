import type { SupabaseClient } from '@supabase/supabase-js'
import type { Turno, CreateTurnoInput, UpdateTurnoInput } from '../types'

type Row = Record<string, unknown> & {
  id: string
  departamento_id: string
  nome: string
  descricao: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  departamentos?: { nome: string }[] | { nome: string } | null
}

function extractNome(val: { nome: string }[] | { nome: string } | null): string | null {
  if (!val) return null
  if (Array.isArray(val)) return val[0]?.nome ?? null
  return val.nome
}

function mapRow(row: Row): Turno {
  return {
    id: row.id,
    departamentoId: row.departamento_id,
    departamentoNome: extractNome(row.departamentos ?? null),
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

export interface TurnoRepository {
  listAll(showDeleted?: boolean): Promise<Turno[]>
  getById(id: string): Promise<Turno | null>
  create(input: CreateTurnoInput, createdBy: string): Promise<Turno>
  update(id: string, input: UpdateTurnoInput, updatedBy: string): Promise<Turno>
  softDelete(id: string, updatedBy: string): Promise<void>
  restore(id: string, updatedBy: string): Promise<void>
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>
  existsByDepartamentoNome(departamentoId: string, nome: string, excludeId?: string): Promise<boolean>
}

export function createTurnoRepository(supabase: SupabaseClient): TurnoRepository {
  return {
    async listAll(showDeleted = false) {
      let query = supabase
        .from('turnos')
        .select(`
          *,
          departamentos!fk_turnos_departamento ( nome )
        `)
        .order('nome', { ascending: true })

      if (!showDeleted) {
        query = query.is('deleted_at', null)
      }

      const { data } = await query
      return ((data as Row[]) ?? []).map(mapRow)
    },

    async getById(id: string) {
      const { data } = await supabase
        .from('turnos')
        .select(`
          *,
          departamentos!fk_turnos_departamento ( nome )
        `)
        .eq('id', id)
        .single()

      if (!data) return null
      return mapRow(data as Row)
    },

    async create(input: CreateTurnoInput, createdBy: string) {
      const { data } = await supabase
        .from('turnos')
        .insert({
          departamento_id: input.departamentoId,
          nome: input.nome,
          descricao: input.descricao || null,
          created_by: createdBy,
          updated_by: createdBy,
        })
        .select(`
          *,
          departamentos!fk_turnos_departamento ( nome )
        `)
        .single()

      if (!data) throw new Error('Erro ao criar turno')
      return mapRow(data as Row)
    },

    async update(id: string, input: UpdateTurnoInput, updatedBy: string) {
      const updates: Record<string, unknown> = { updated_by: updatedBy, updated_at: new Date().toISOString() }
      if (input.departamentoId !== undefined) updates.departamento_id = input.departamentoId
      if (input.nome !== undefined) updates.nome = input.nome
      if (input.descricao !== undefined) updates.descricao = input.descricao || null
      if (input.isActive !== undefined) updates.is_active = input.isActive

      const { data } = await supabase
        .from('turnos')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          departamentos!fk_turnos_departamento ( nome )
        `)
        .single()

      if (!data) throw new Error('Erro ao atualizar turno')
      return mapRow(data as Row)
    },

    async softDelete(id: string, updatedBy: string) {
      const { error } = await supabase
        .from('turnos')
        .update({
          deleted_at: new Date().toISOString(),
          is_active: false,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao excluir turno')
    },

    async restore(id: string, updatedBy: string) {
      const { error } = await supabase
        .from('turnos')
        .update({
          deleted_at: null,
          is_active: true,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao restaurar turno')
    },

    async setActive(id: string, isActive: boolean, updatedBy: string) {
      const { error } = await supabase
        .from('turnos')
        .update({
          is_active: isActive,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao alterar status do turno')
    },

    async existsByDepartamentoNome(departamentoId: string, nome: string, excludeId?: string) {
      let query = supabase
        .from('turnos')
        .select('id', { count: 'exact', head: true })
        .eq('departamento_id', departamentoId)
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
