import type { SupabaseClient } from '@supabase/supabase-js'
import type { Colaborador, CreateColaboradorInput, UpdateColaboradorInput, ColaboradorListParams, ColaboradorListResult } from '../types'

function extractNome(val: { nome: string }[] | { nome: string } | null): string | null {
  if (!val) return null
  if (Array.isArray(val)) return val[0]?.nome ?? null
  return val.nome
}

type RawRow = {
  id: string
  auth_user_id: string | null
  matricula: string | null
  nome: string
  cpf: string | null
  email: string | null
  telefone: string | null
  data_nascimento: string | null
  data_admissao: string | null
  avatar_url: string | null
  genero: string | null
  estado_civil: string | null
  departamento_id: string | null
  unidade_id: string | null
  cargo_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  departamentos?: { nome: string }[] | { nome: string } | null
  cargos?: { nome: string }[] | { nome: string } | null
  unidades?: { nome: string }[] | { nome: string } | null
}

function mapRow(raw: RawRow, roles?: string[]): Colaborador {
  return {
    id: raw.id,
    authUserId: raw.auth_user_id,
    matricula: raw.matricula,
    nome: raw.nome,
    cpf: raw.cpf,
    email: raw.email,
    telefone: raw.telefone,
    dataNascimento: raw.data_nascimento,
    dataAdmissao: raw.data_admissao,
    avatarUrl: raw.avatar_url,
    genero: raw.genero,
    estadoCivil: raw.estado_civil,
    departamentoId: raw.departamento_id,
    departamentoNome: extractNome(raw.departamentos ?? null),
    unidadeId: raw.unidade_id,
    unidadeNome: extractNome(raw.unidades ?? null),
    cargoId: raw.cargo_id,
    cargoNome: extractNome(raw.cargos ?? null),
    isActive: raw.is_active,
    roles: roles ?? [],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    createdBy: raw.created_by,
    updatedBy: raw.updated_by,
    deletedAt: raw.deleted_at,
  }
}

async function loadRoles(supabase: SupabaseClient, colaboradorId: string): Promise<string[]> {
  const { data } = await supabase
    .from('colaborador_roles')
    .select('role:roles!inner ( nome )')
    .eq('colaborador_id', colaboradorId)

  return [
    ...new Set(
      ((data ?? []) as unknown as { role: { nome: string } }[]).map((r) => r.role.nome),
    ),
  ]
}

const BASE_SELECT = `
  id,
  auth_user_id,
  matricula,
  nome,
  cpf,
  email,
  telefone,
  data_nascimento,
  data_admissao,
  avatar_url,
  genero,
  estado_civil,
  departamento_id,
  unidade_id,
  cargo_id,
  is_active,
  created_at,
  updated_at,
  created_by,
  updated_by,
  deleted_at,
  departamentos!fk_colaboradores_departamento ( nome ),
  cargos!fk_colaboradores_cargo ( nome ),
  unidades!fk_colaboradores_unidade ( nome )
`

export interface ColaboradorRepository {
  list(params?: ColaboradorListParams): Promise<ColaboradorListResult>
  listAll(): Promise<Colaborador[]>
  getById(id: string): Promise<Colaborador | null>
  create(input: CreateColaboradorInput, createdBy: string): Promise<Colaborador>
  update(id: string, input: UpdateColaboradorInput, updatedBy: string): Promise<Colaborador>
  softDelete(id: string, updatedBy: string): Promise<void>
  restore(id: string, updatedBy: string): Promise<void>
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>
  existsByMatricula(matricula: string, excludeId?: string): Promise<boolean>
  existsByCpf(cpf: string, excludeId?: string): Promise<boolean>
  existsByEmail(email: string, excludeId?: string): Promise<boolean>
  getRoles(colaboradorId: string): Promise<string[]>
  setRoles(colaboradorId: string, roleIds: string[]): Promise<void>
  getAllRoles(): Promise<{ id: string; nome: string; descricao: string | null }[]>
}

export function createColaboradorRepository(supabase: SupabaseClient): ColaboradorRepository {
  return {
    async list(params = {}): Promise<ColaboradorListResult> {
      const {
        search,
        departamentoId,
        cargoId,
        unidadeId,
        status = 'active',
        page = 1,
        pageSize = 10,
        sortBy = 'nome',
        sortOrder = 'asc',
      } = params

      let query = supabase.from('colaboradores').select(BASE_SELECT, { count: 'exact' })

      if (status === 'active' || !status) {
        query = query.is('deleted_at', null)
      } else if (status === 'inactive') {
        query = query.not('deleted_at', 'is', null)
      }

      if (search) {
        query = query.or(
          `nome.ilike.%${search}%,matricula.ilike.%${search}%,cpf.ilike.%${search}%,email.ilike.%${search}%`,
        )
      }
      if (departamentoId) query = query.eq('departamento_id', departamentoId)
      if (cargoId) query = query.eq('cargo_id', cargoId)
      if (unidadeId) query = query.eq('unidade_id', unidadeId)

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      query = query
        .order(sortBy === 'nome' ? 'nome' : 'created_at', { ascending: sortOrder === 'asc' })
        .range(from, to)

      const { data, count } = await query
      const items = ((data ?? []) as unknown as RawRow[]).map((r) => mapRow(r))

      const itemsWithRoles = await Promise.all(
        items.map(async (item) => {
          if (!item.deletedAt) {
            const roles = await loadRoles(supabase, item.id)
            return { ...item, roles }
          }
          return item
        }),
      )

      return {
        data: itemsWithRoles,
        total: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      }
    },

    async listAll() {
      const { data } = await supabase
        .from('colaboradores')
        .select(BASE_SELECT)
        .is('deleted_at', null)
        .order('nome', { ascending: true })

      return ((data ?? []) as unknown as RawRow[]).map((r) => mapRow(r))
    },

    async getById(id: string) {
      const { data } = await supabase
        .from('colaboradores')
        .select(BASE_SELECT)
        .eq('id', id)
        .single()

      if (!data) return null
      const row = data as unknown as RawRow
      const roles = await loadRoles(supabase, row.id)
      return mapRow(row, roles)
    },

    async create(input: CreateColaboradorInput, createdBy: string) {
      const { data } = await supabase
        .from('colaboradores')
        .insert({
          nome: input.nome,
          matricula: input.matricula || null,
          cpf: input.cpf?.replace(/\D/g, '') || null,
          email: input.email || null,
          telefone: input.telefone || null,
          data_nascimento: input.dataNascimento || null,
          data_admissao: input.dataAdmissao || null,
          genero: input.genero || null,
          estado_civil: input.estadoCivil || null,
          departamento_id: input.departamentoId || null,
          unidade_id: input.unidadeId || null,
          cargo_id: input.cargoId || null,
          created_by: createdBy,
          updated_by: createdBy,
        })
        .select(BASE_SELECT)
        .single()

      if (!data) throw new Error('Erro ao criar colaborador')
      return mapRow(data as unknown as RawRow)
    },

    async update(id: string, input: UpdateColaboradorInput, updatedBy: string) {
      const updateData: Record<string, unknown> = {
        updated_by: updatedBy,
        updated_at: new Date().toISOString(),
      }

      if (input.nome !== undefined) updateData.nome = input.nome
      if (input.matricula !== undefined) updateData.matricula = input.matricula || null
      if (input.cpf !== undefined) updateData.cpf = input.cpf?.replace(/\D/g, '') || null
      if (input.email !== undefined) updateData.email = input.email || null
      if (input.telefone !== undefined) updateData.telefone = input.telefone || null
      if (input.dataNascimento !== undefined) updateData.data_nascimento = input.dataNascimento || null
      if (input.dataAdmissao !== undefined) updateData.data_admissao = input.dataAdmissao || null
      if (input.avatarUrl !== undefined) updateData.avatar_url = input.avatarUrl || null
      if (input.genero !== undefined) updateData.genero = input.genero || null
      if (input.estadoCivil !== undefined) updateData.estado_civil = input.estadoCivil || null
      if (input.departamentoId !== undefined) updateData.departamento_id = input.departamentoId
      if (input.unidadeId !== undefined) updateData.unidade_id = input.unidadeId
      if (input.cargoId !== undefined) updateData.cargo_id = input.cargoId
      if (input.isActive !== undefined) updateData.is_active = input.isActive

      const { data } = await supabase
        .from('colaboradores')
        .update(updateData)
        .eq('id', id)
        .select(BASE_SELECT)
        .single()

      if (!data) throw new Error('Erro ao atualizar colaborador')
      const row = data as unknown as RawRow
      const roles = await loadRoles(supabase, row.id)
      return mapRow(row, roles)
    },

    async softDelete(id: string, updatedBy: string) {
      const { error } = await supabase
        .from('colaboradores')
        .update({
          deleted_at: new Date().toISOString(),
          is_active: false,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao excluir colaborador')
    },

    async restore(id: string, updatedBy: string) {
      const { error } = await supabase
        .from('colaboradores')
        .update({
          deleted_at: null,
          is_active: true,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao restaurar colaborador')
    },

    async setActive(id: string, isActive: boolean, updatedBy: string) {
      const { error } = await supabase
        .from('colaboradores')
        .update({
          is_active: isActive,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao alterar status do colaborador')
    },

    async existsByMatricula(matricula: string, excludeId?: string) {
      let query = supabase
        .from('colaboradores')
        .select('id', { count: 'exact', head: true })
        .eq('matricula', matricula)
        .is('deleted_at', null)

      if (excludeId) query = query.neq('id', excludeId)
      const { count } = await query
      return (count ?? 0) > 0
    },

    async existsByCpf(cpf: string, excludeId?: string) {
      const digits = cpf.replace(/\D/g, '')
      let query = supabase
        .from('colaboradores')
        .select('id', { count: 'exact', head: true })
        .eq('cpf', digits)
        .is('deleted_at', null)

      if (excludeId) query = query.neq('id', excludeId)
      const { count } = await query
      return (count ?? 0) > 0
    },

    async existsByEmail(email: string, excludeId?: string) {
      let query = supabase
        .from('colaboradores')
        .select('id', { count: 'exact', head: true })
        .eq('email', email)
        .is('deleted_at', null)

      if (excludeId) query = query.neq('id', excludeId)
      const { count } = await query
      return (count ?? 0) > 0
    },

    async getRoles(colaboradorId: string) {
      const { data } = await supabase
        .from('colaborador_roles')
        .select('role:roles!inner ( nome )')
        .eq('colaborador_id', colaboradorId)

      return [
        ...new Set(
          ((data ?? []) as unknown as { role: { nome: string } }[]).map((r) => r.role.nome),
        ),
      ]
    },

    async setRoles(colaboradorId: string, roleIds: string[]) {
      await supabase.from('colaborador_roles').delete().eq('colaborador_id', colaboradorId)

      if (roleIds.length > 0) {
        const { error } = await supabase.from('colaborador_roles').insert(
          roleIds.map((roleId) => ({ colaborador_id: colaboradorId, role_id: roleId })),
        )
        if (error) throw new Error('Erro ao atribuir funções')
      }
    },

    async getAllRoles() {
      const { data } = await supabase
        .from('roles')
        .select('id, nome, descricao')
        .order('nome', { ascending: true })

      return (data ?? []) as { id: string; nome: string; descricao: string | null }[]
    },
  }
}
