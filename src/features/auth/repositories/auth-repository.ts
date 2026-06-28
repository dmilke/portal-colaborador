import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthSession, ColaboradorSession } from '../types'

export interface AuthRepository {
  login(email: string, password: string): Promise<AuthSession>
  logout(): Promise<void>
  getSession(): Promise<AuthSession | null>
  getCurrentColaborador(): Promise<ColaboradorSession | null>
}

export function createAuthRepository(supabase: SupabaseClient): AuthRepository {
  return {
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.session?.user) {
        throw new Error('Falha ao criar sessão')
      }

      const user = data.session.user
      const colaborador = await lookupColaborador(supabase, user.id)

      return {
        user: { id: user.id, email: user.email ?? '' },
        colaboradorId: colaborador?.id ?? null,
        roles: colaborador?.roles ?? [],
      }
    },

    async logout() {
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error(error.message)
    },

    async getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return null

      return {
        user: { id: session.user.id, email: session.user.email ?? '' },
        colaboradorId: null,
        roles: [],
      }
    },

    async getCurrentColaborador() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      return lookupColaborador(supabase, user.id)
    },
  }
}

function extractNome(
  val: { nome: string }[] | { nome: string } | null,
): string | null {
  if (!val) return null
  if (Array.isArray(val)) return val[0]?.nome ?? null
  return val.nome
}

async function lookupColaborador(
  supabase: SupabaseClient,
  authUserId: string,
): Promise<ColaboradorSession | null> {
  const { data: raw, error } = await supabase
    .from('colaboradores')
    .select(`
      id,
      auth_user_id,
      nome,
      email,
      avatar_url,
      departamento_id,
      cargo_id,
      unidade_id,
      data_admissao,
      departamentos!fk_colaboradores_departamento ( nome ),
      cargos!fk_colaboradores_cargo ( nome ),
      unidades!fk_colaboradores_unidade ( nome )
    `)
    .eq('auth_user_id', authUserId)
    .is('deleted_at', null)
    .single()

  if (error || !raw) return null

  const data = raw as unknown as {
    id: string
    auth_user_id: string | null
    nome: string
    email: string | null
    avatar_url: string | null
    departamento_id: string | null
    cargo_id: string | null
    unidade_id: string | null
    data_admissao: string | null
    departamentos: { nome: string }[] | { nome: string } | null
    cargos: { nome: string }[] | { nome: string } | null
    unidades: { nome: string }[] | { nome: string } | null
  }

  const { data: rolesData } = await supabase
    .from('colaborador_roles')
    .select(`
      role:roles!inner (
        nome,
        permissions:role_permissions!inner (
            permission:permissions!inner (
            nome
          )
        )
      )
    `)
    .eq('colaborador_id', data.id)

  const roles = [
    ...new Set(
      ((rolesData ?? []) as unknown as {
        role: { nome: string; permissions: { permission: { nome: string } }[] }
      }[]).map((r) => r.role.nome),
    ),
  ]

  const permissions = [
    ...new Set(
      ((rolesData ?? []) as unknown as {
        role: { permissions: { permission: { nome: string } }[] }
      }[]).flatMap((r) =>
        r.role.permissions.map((p) => p.permission.nome),
      ),
    ),
  ]

  return {
    id: data.id,
    authUserId: data.auth_user_id!,
    nome: data.nome,
    email: data.email,
    avatarUrl: data.avatar_url ?? null,
    departamentoId: data.departamento_id,
    departamentoNome: extractNome(data.departamentos),
    cargoId: data.cargo_id,
    cargoNome: extractNome(data.cargos),
    unidadeId: data.unidade_id,
    unidadeNome: extractNome(data.unidades),
    dataAdmissao: data.data_admissao ?? null,
    roles,
    permissions,
  }
}
