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

async function lookupColaborador(
  supabase: SupabaseClient,
  authUserId: string,
): Promise<ColaboradorSession | null> {
  const { data: colaborador } = await supabase
    .from('colaboradores')
    .select(`
      id,
      auth_user_id,
      nome,
      email,
      avatar_url,
      departamento_id,
      cargo_id,
      unidade_id
    `)
    .eq('auth_user_id', authUserId)
    .is('deleted_at', null)
    .single()

  if (!colaborador) return null

  const { data: rolesData } = await supabase
    .from('colaborador_roles')
    .select(`
      role:roles (
        nome,
        permissions:role_permissions (
          permission:permissions (
            codigo
          )
        )
      )
    `)
    .eq('colaborador_id', colaborador.id)

  const roles = (rolesData ?? []).map((r: unknown) => {
    const row = r as {
      role: { nome: string; permissions: { permission: { codigo: string } }[] }
    }
    return row.role.nome
  })

  const permissions = (rolesData ?? []).flatMap((r: unknown) => {
    const row = r as {
      role: { permissions: { permission: { codigo: string } }[] }
    }
    return row.role.permissions.map((p) => p.permission.codigo)
  })

  return {
    id: colaborador.id,
    authUserId: colaborador.auth_user_id!,
    nome: colaborador.nome,
    email: colaborador.email,
    avatarUrl: colaborador.avatar_url ?? null,
    departamentoId: colaborador.departamento_id,
    departamentoNome: null,
    cargoId: colaborador.cargo_id,
    cargoNome: null,
    unidadeId: colaborador.unidade_id,
    unidadeNome: null,
    roles: [...new Set(roles)],
    permissions: [...new Set(permissions)],
  }
}
