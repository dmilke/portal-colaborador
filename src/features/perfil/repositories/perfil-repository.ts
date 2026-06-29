import { createClient } from '@/lib/supabase/server'
import type { ColaboradorPerfil, UpdatePerfilInput } from '../types'

type Row = Record<string, unknown> & {
  id: string
  nome: string
  matricula: string | null
  cpf: string | null
  email: string | null
  telefone: string | null
  data_nascimento: string | null
  data_admissao: string | null
  avatar_url: string | null
  genero: string | null
  estado_civil: string | null
  is_active: boolean
  departamentos: { nome: string }[] | { nome: string } | null
  cargos: { nome: string }[] | { nome: string } | null
  unidades: { nome: string }[] | { nome: string } | null
}

function extractNome(val: { nome: string }[] | { nome: string } | null): string | null {
  if (!val) return null
  if (Array.isArray(val)) return val[0]?.nome ?? null
  return val.nome
}

export class PerfilRepository {
  async getCurrentUser(authUserId: string): Promise<ColaboradorPerfil | null> {
    const supabase = await createClient()

    const { data: raw, error } = await supabase
      .from('colaboradores')
      .select(`
        id, nome, matricula, cpf, email, telefone,
        data_nascimento, data_admissao, avatar_url,
        genero, estado_civil, is_active,
        departamentos!fk_colaboradores_departamento ( nome ),
        cargos!fk_colaboradores_cargo ( nome ),
        unidades!fk_colaboradores_unidade ( nome )
      `)
      .eq('auth_user_id', authUserId)
      .is('deleted_at', null)
      .single()

    if (error || !raw) return null

    const data = raw as unknown as Row

    const { data: rolesData } = await supabase
      .from('colaborador_roles')
      .select('role:roles!inner ( nome )')
      .eq('colaborador_id', data.id)

    const roles = [
      ...new Set(
        ((rolesData ?? []) as unknown as { role: { nome: string } }[]).map((r) => r.role.nome),
      ),
    ]

    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      avatarUrl: data.avatar_url,
      dataNascimento: data.data_nascimento,
      genero: data.genero,
      estadoCivil: data.estado_civil,
      departamentoNome: extractNome(data.departamentos),
      cargoNome: extractNome(data.cargos),
      unidadeNome: extractNome(data.unidades),
      roles,
    }
  }

  async updateProfile(colaboradorId: string, input: UpdatePerfilInput, updatedBy: string): Promise<void> {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = { updated_by: updatedBy }

    if (input.nome !== undefined) updates.nome = input.nome
    if (input.telefone !== undefined) updates.telefone = input.telefone || null
    if (input.avatarUrl !== undefined) updates.avatar_url = input.avatarUrl || null
    if (input.dataNascimento !== undefined) updates.data_nascimento = input.dataNascimento || null
    if (input.genero !== undefined) updates.genero = input.genero || null
    if (input.estadoCivil !== undefined) updates.estado_civil = input.estadoCivil || null

    const { error } = await supabase
      .from('colaboradores')
      .update(updates)
      .eq('id', colaboradorId)

    if (error) throw error
  }

  async getColaboradorId(authUserId: string): Promise<string | null> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('colaboradores')
      .select('id')
      .eq('auth_user_id', authUserId)
      .is('deleted_at', null)
      .single()
    return data?.id ?? null
  }
}
