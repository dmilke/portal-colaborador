'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/src/shared/lib/permissions'
import { createDepartamentoRepository } from '../repositories/departamento-repository'
import { createDepartamentoService } from '../services/departamento-service'
import { departamentoSchema, departamentoUpdateSchema } from '../schemas'

export type DepartamentoActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | null

export async function createDepartamentoAction(
  prevState: DepartamentoActionState,
  formData: FormData,
): Promise<DepartamentoActionState> {
  const perm = await checkPermission('departamentos.create')
  if (!perm.allowed) return { message: perm.error }

  const raw = {
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string,
  }

  const validated = departamentoSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const repository = createDepartamentoRepository(supabase)
  const service = createDepartamentoService(repository)

  try {
    await service.create(
      { nome: validated.data.nome, descricao: validated.data.descricao || null },
      perm.colaboradorId!,
    )
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao criar departamento' }
  }

  revalidatePath('/departamentos')
  redirect('/departamentos')
}

export async function updateDepartamentoAction(
  prevState: DepartamentoActionState,
  formData: FormData,
): Promise<DepartamentoActionState> {
  const perm = await checkPermission('departamentos.update')
  if (!perm.allowed) return { message: perm.error }

  const id = formData.get('id') as string
  if (!id) return { message: 'ID não informado' }

  const raw = {
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string,
  }

  const validated = departamentoUpdateSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const repository = createDepartamentoRepository(supabase)
  const service = createDepartamentoService(repository)

  try {
    await service.update(id, validated.data, perm.colaboradorId!)
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao atualizar departamento' }
  }

  revalidatePath('/departamentos')
  redirect('/departamentos')
}

export async function deleteDepartamentoAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('departamentos.delete')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createDepartamentoRepository(supabase)
  const service = createDepartamentoService(repository)

  try {
    await service.softDelete(id, perm.colaboradorId!)
    revalidatePath('/departamentos')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao excluir departamento' }
  }
}

export async function restoreDepartamentoAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('departamentos.delete')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createDepartamentoRepository(supabase)
  const service = createDepartamentoService(repository)

  try {
    await service.restore(id, perm.colaboradorId!)
    revalidatePath('/departamentos')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao restaurar departamento' }
  }
}

export async function toggleActiveDepartamentoAction(id: string, isActive: boolean): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('departamentos.update')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createDepartamentoRepository(supabase)
  const service = createDepartamentoService(repository)

  try {
    await service.setActive(id, isActive, perm.colaboradorId!)
    revalidatePath('/departamentos')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao alterar status' }
  }
}
