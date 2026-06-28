'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/src/shared/lib/permissions'
import { createUnidadeRepository } from '../repositories/unidade-repository'
import { createUnidadeService } from '../services/unidade-service'
import { unidadeSchema, unidadeUpdateSchema } from '../schemas/unidade-schema'

export type UnidadeActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | null

export async function createUnidadeAction(
  prevState: UnidadeActionState,
  formData: FormData,
): Promise<UnidadeActionState> {
  const perm = await checkPermission('unidades.create')
  if (!perm.allowed) return { message: perm.error }

  const raw = {
    nome: formData.get('nome') as string,
    sigla: formData.get('sigla') as string,
    endereco: formData.get('endereco') as string,
  }

  const validated = unidadeSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const repository = createUnidadeRepository(supabase)
  const service = createUnidadeService(repository)

  try {
    await service.create(
      {
        nome: validated.data.nome,
        sigla: validated.data.sigla || undefined,
        endereco: validated.data.endereco || undefined,
      },
      perm.colaboradorId!,
    )
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao criar unidade' }
  }

  revalidatePath('/unidades')
  redirect('/unidades')
}

export async function updateUnidadeAction(
  prevState: UnidadeActionState,
  formData: FormData,
): Promise<UnidadeActionState> {
  const perm = await checkPermission('unidades.update')
  if (!perm.allowed) return { message: perm.error }

  const id = formData.get('id') as string
  if (!id) return { message: 'ID não informado' }

  const raw = {
    nome: formData.get('nome') as string,
    sigla: formData.get('sigla') as string,
    endereco: formData.get('endereco') as string,
  }

  const validated = unidadeUpdateSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const repository = createUnidadeRepository(supabase)
  const service = createUnidadeService(repository)

  try {
    await service.update(id, validated.data, perm.colaboradorId!)
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao atualizar unidade' }
  }

  revalidatePath('/unidades')
  redirect('/unidades')
}

export async function deleteUnidadeAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('unidades.delete')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createUnidadeRepository(supabase)
  const service = createUnidadeService(repository)

  try {
    await service.softDelete(id, perm.colaboradorId!)
    revalidatePath('/unidades')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao excluir unidade' }
  }
}

export async function restoreUnidadeAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('unidades.delete')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createUnidadeRepository(supabase)
  const service = createUnidadeService(repository)

  try {
    await service.restore(id, perm.colaboradorId!)
    revalidatePath('/unidades')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao restaurar unidade' }
  }
}

export async function toggleActiveUnidadeAction(id: string, isActive: boolean): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('unidades.update')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createUnidadeRepository(supabase)
  const service = createUnidadeService(repository)

  try {
    await service.setActive(id, isActive, perm.colaboradorId!)
    revalidatePath('/unidades')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao alterar status' }
  }
}
