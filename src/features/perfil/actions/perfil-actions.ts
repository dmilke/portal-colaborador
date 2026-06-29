'use server'

import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { perfilService } from '../services/perfil-service'
import { createAdminClient } from '@/lib/supabase/admin'
import { dispatch, emit, initializeEventHandlers } from '@/src/features/eventos'

initializeEventHandlers()

export type ProfileActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | null

export async function updatePerfilAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await getCurrentColaborador()
  if (!session) return { message: 'Usuário não autenticado' }

  const input = {
    nome: formData.get('nome') as string || undefined,
    telefone: formData.get('telefone') as string || undefined,
    avatarUrl: formData.get('avatarUrl') as string || undefined,
    dataNascimento: formData.get('dataNascimento') as string || undefined,
    genero: formData.get('genero') as string || undefined,
    estadoCivil: formData.get('estadoCivil') as string || undefined,
  }

  try {
    await perfilService.updatePerfil(input)

    const admin = await createAdminClient()
    await admin.from('auditoria').insert({
      colaborador_id: session.id,
      acao: 'alteracao',
      entidade_tipo: 'perfil',
      entidade_id: session.id,
      descricao: 'Perfil atualizado pelo colaborador',
    })

    await dispatch(emit('user.updated', 'perfil', {
      id: session.id,
      nome: input.nome ?? session.nome,
    }, session.id))

    return { success: true, message: 'Perfil atualizado com sucesso' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar perfil'
    return { message }
  }
}

export async function changePasswordAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await getCurrentColaborador()
  if (!session) return { message: 'Usuário não autenticado' }

  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { message: 'Preencha todos os campos' }
  }

  if (newPassword.length < 6) {
    return { message: 'A nova senha deve ter pelo menos 6 caracteres' }
  }

  if (newPassword !== confirmPassword) {
    return { message: 'As senhas não conferem' }
  }

  try {
    const supabase = await createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.email ?? '',
      password: currentPassword,
    })

    if (signInError) {
      return { message: 'Senha atual incorreta' }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    const admin = await createAdminClient()
    await admin.from('auditoria').insert({
      colaborador_id: session.id,
      acao: 'alteracao',
      entidade_tipo: 'perfil',
      entidade_id: session.id,
      descricao: 'Senha alterada pelo colaborador',
    })

    return { success: true, message: 'Senha alterada com sucesso' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao alterar senha'
    return { message }
  }
}
