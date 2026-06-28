'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ColaboradorSession } from '../types'

interface UseAuthResult {
  colaborador: ColaboradorSession | null
  loading: boolean
  error: string | null
}

export function useAuth(): UseAuthResult {
  const [colaborador, setColaborador] = useState<ColaboradorSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user || cancelled) {
          if (!cancelled) setLoading(false)
          return
        }

        const { data: raw, error: colError } = await supabase
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
          .eq('auth_user_id', user.id)
          .is('deleted_at', null)
          .single()

        if (cancelled) return

        if (colError || !raw) {
          setColaborador(null)
          return
        }

        const data = raw as unknown as {
          id: string
          auth_user_id: string
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

        const extractNome = (
          val: { nome: string }[] | { nome: string } | null,
        ): string | null => {
          if (!val) return null
          if (Array.isArray(val)) return val[0]?.nome ?? null
          return val.nome
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

        if (!cancelled) {
          setColaborador({
            id: data.id,
            authUserId: data.auth_user_id,
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
          })
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => { cancelled = true }
  }, [])

  return { colaborador, loading, error }
}
