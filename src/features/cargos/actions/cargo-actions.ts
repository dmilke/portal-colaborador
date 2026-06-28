'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/src/shared/lib/permissions'
import { createCargoRepository } from '../repositories/cargo-repository'
import { createCargoService } from '../services/cargo-service'
import { cargoSchema, cargoUpdateSchema } from '../schemas/cargo-schema'

export type CargoActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | null

export async function createCargoAction(
  prevState: CargoActionState,
  formData: FormData,
): Promise<CargoActionState> {
  const perm = await checkPermission('cargos.create')
  if (!perm.allowed) return { message: perm.error }

  const raw = {
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string,
  }

  const validated = cargoSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const repository = createCargoRepository(supabase)
  const service = createCargoService(repository)

  try {
    await service.create(
      { nome: validated.data.nome, descricao: validated.data.descricao || null },
      perm.colaboradorId!,
    )
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao criar cargo' }
  }

  revalidatePath('/cargos')
  redirect('/cargos')
}

export async function updateCargoAction(
  prevState: CargoActionState,
  formData: FormData,
): Promise<CargoActionState> {
  const perm = await checkPermission('cargos.update')
  if (!perm.allowed) return { message: perm.error }

  const id = formData.get('id') as string
  if (!id) return { message: 'ID não informado' }

  const raw = {
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string,
  }

  const validated = cargoUpdateSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const repository = createCargoRepository(supabase)
  const service = createCargoService(repository)

  try {
    await service.update(id, validated.data, perm.colaboradorId!)
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao atualizar cargo' }
  }

  revalidatePath('/cargos')
  redirect('/cargos')
}

export async function deleteCargoAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('cargos.delete')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createCargoRepository(supabase)
  const service = createCargoService(repository)

  try {
    await service.softDelete(id, perm.colaboradorId!)
    revalidatePath('/cargos')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao excluir cargo' }
  }
}

export async function restoreCargoAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('cargos.delete')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createCargoRepository(supabase)
  const service = createCargoService(repository)

  try {
    await service.restore(id, perm.colaboradorId!)
    revalidatePath('/cargos')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao restaurar cargo' }
  }
}

export async function toggleActiveCargoAction(id: string, isActive: boolean): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('cargos.update')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createCargoRepository(supabase)
  const service = createCargoService(repository)

  try {
    await service.setActive(id, isActive, perm.colaboradorId!)
    revalidatePath('/cargos')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao alterar status' }
  }
}
