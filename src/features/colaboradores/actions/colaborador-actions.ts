'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkPermission } from '@/src/shared/lib/permissions'
import { createColaboradorRepository } from '../repositories/colaborador-repository'
import { createColaboradorService } from '../services/colaborador-service'
import { colaboradorSchema, colaboradorUpdateSchema } from '../schemas/colaborador-schema'

export type ColaboradorActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | null

export async function createColaboradorAction(
  prevState: ColaboradorActionState,
  formData: FormData,
): Promise<ColaboradorActionState> {
  const perm = await checkPermission('colaboradores.create')
  if (!perm.allowed) return { message: perm.error }

  const raw = {
    nome: formData.get('nome') as string,
    matricula: formData.get('matricula') as string,
    cpf: formData.get('cpf') as string,
    email: formData.get('email') as string,
    telefone: formData.get('telefone') as string,
    dataNascimento: formData.get('dataNascimento') as string,
    dataAdmissao: formData.get('dataAdmissao') as string,
    genero: formData.get('genero') as string,
    estadoCivil: formData.get('estadoCivil') as string,
    departamentoId: formData.get('departamentoId') as string || null,
    unidadeId: formData.get('unidadeId') as string || null,
    cargoId: formData.get('cargoId') as string || null,
    inviteUser: formData.get('inviteUser') === 'true',
    password: formData.get('password') as string,
  }

  const validated = colaboradorSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const repository = createColaboradorRepository(supabase)
  const service = createColaboradorService(repository)

  try {
    const colaborador = await service.create(
      {
        nome: validated.data.nome,
        matricula: validated.data.matricula || undefined,
        cpf: validated.data.cpf || undefined,
        email: validated.data.email || undefined,
        telefone: validated.data.telefone || undefined,
        dataNascimento: validated.data.dataNascimento || undefined,
        dataAdmissao: validated.data.dataAdmissao || undefined,
        genero: validated.data.genero || undefined,
        estadoCivil: validated.data.estadoCivil || undefined,
        departamentoId: validated.data.departamentoId ?? null,
        unidadeId: validated.data.unidadeId ?? null,
        cargoId: validated.data.cargoId ?? null,
      },
      perm.colaboradorId!,
    )

    const inviteEmail = formData.get('inviteEmail') as string || raw.email
    if (raw.inviteUser && inviteEmail && raw.password) {
      const supabaseAdmin = await createAdminClient()
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: inviteEmail,
        password: raw.password,
        email_confirm: true,
        user_metadata: { colaborador_id: colaborador.id },
      })

      if (authError) {
        return { message: `Colaborador criado, mas falha ao criar usuário: ${authError.message}` }
      }

      if (authUser?.user?.id) {
        await supabase
          .from('colaboradores')
          .update({ auth_user_id: authUser.user.id, updated_by: perm.colaboradorId! })
          .eq('id', colaborador.id)
      }
    }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao criar colaborador' }
  }

  revalidatePath('/colaboradores')
  redirect('/colaboradores')
}

export async function updateColaboradorAction(
  prevState: ColaboradorActionState,
  formData: FormData,
): Promise<ColaboradorActionState> {
  const perm = await checkPermission('colaboradores.update')
  if (!perm.allowed) return { message: perm.error }

  const id = formData.get('id') as string
  if (!id) return { message: 'ID não informado' }

  const raw = {
    nome: formData.get('nome') as string,
    matricula: formData.get('matricula') as string,
    cpf: formData.get('cpf') as string,
    email: formData.get('email') as string,
    telefone: formData.get('telefone') as string,
    dataNascimento: formData.get('dataNascimento') as string,
    dataAdmissao: formData.get('dataAdmissao') as string,
    genero: formData.get('genero') as string,
    estadoCivil: formData.get('estadoCivil') as string,
    departamentoId: formData.get('departamentoId') as string || null,
    unidadeId: formData.get('unidadeId') as string || null,
    cargoId: formData.get('cargoId') as string || null,
  }

  const validated = colaboradorUpdateSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const repository = createColaboradorRepository(supabase)
  const service = createColaboradorService(repository)

  try {
    await service.update(id, validated.data, perm.colaboradorId!)
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao atualizar colaborador' }
  }

  revalidatePath('/colaboradores')
  redirect('/colaboradores')
}

export async function deleteColaboradorAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('colaboradores.delete')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createColaboradorRepository(supabase)
  const service = createColaboradorService(repository)

  try {
    await service.softDelete(id, perm.colaboradorId!)
    revalidatePath('/colaboradores')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao excluir colaborador' }
  }
}

export async function restoreColaboradorAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('colaboradores.delete')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createColaboradorRepository(supabase)
  const service = createColaboradorService(repository)

  try {
    await service.restore(id, perm.colaboradorId!)
    revalidatePath('/colaboradores')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao restaurar colaborador' }
  }
}

export async function toggleActiveColaboradorAction(id: string, isActive: boolean): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('colaboradores.update')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createColaboradorRepository(supabase)
  const service = createColaboradorService(repository)

  try {
    await service.setActive(id, isActive, perm.colaboradorId!)
    revalidatePath('/colaboradores')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao alterar status' }
  }
}

export async function updateRolesAction(
  colaboradorId: string,
  roleIds: string[],
): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('colaboradores.update')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createColaboradorRepository(supabase)
  const service = createColaboradorService(repository)

  try {
    await service.setRoles(colaboradorId, roleIds)
    revalidatePath('/colaboradores')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao atualizar funções' }
  }
}

export async function inviteUserAction(
  colaboradorId: string,
  email: string,
  password: string,
): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('colaboradores.update')
  if (!perm.allowed) return { message: perm.error }

  const supabaseAdmin = await createAdminClient()
  const supabase = await createClient()

  try {
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { colaborador_id: colaboradorId },
    })

    if (authError) throw new Error(authError.message)

    if (authUser?.user?.id) {
      await supabase
        .from('colaboradores')
        .update({ auth_user_id: authUser.user.id, updated_by: perm.colaboradorId! })
        .eq('id', colaboradorId)
    }

    revalidatePath('/colaboradores')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao convidar usuário' }
  }
}

export async function deactivateAuthUserAction(
  colaboradorId: string,
  authUserId: string,
): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('colaboradores.update')
  if (!perm.allowed) return { message: perm.error }

  const supabaseAdmin = await createAdminClient()

  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
      ban_duration: '876600h',
    })

    if (error) throw new Error(error.message)

    revalidatePath('/colaboradores')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao desativar usuário' }
  }
}

export async function reactivateAuthUserAction(
  colaboradorId: string,
  authUserId: string,
): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('colaboradores.update')
  if (!perm.allowed) return { message: perm.error }

  const supabaseAdmin = await createAdminClient()

  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
      ban_duration: '0h',
    })

    if (error) throw new Error(error.message)

    revalidatePath('/colaboradores')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao reativar usuário' }
  }
}
