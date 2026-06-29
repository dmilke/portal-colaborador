'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/src/shared/lib/permissions'
import { createTurnoRepository } from '../repositories/turno-repository'
import { createTurnoService } from '../services/turno-service'
import { turnoSchema, turnoUpdateSchema } from '../schemas/turno-schema'

export type TurnoActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | null

export async function createTurnoAction(
  prevState: TurnoActionState,
  formData: FormData,
): Promise<TurnoActionState> {
  const perm = await checkPermission('turnos.create')
  if (!perm.allowed) return { message: perm.error }

  const raw = {
    departamentoId: formData.get('departamentoId') as string,
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string,
  }

  const validated = turnoSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados invalidos' }
  }

  const supabase = await createClient()
  const repository = createTurnoRepository(supabase)
  const service = createTurnoService(repository)

  try {
    await service.create(
      {
        departamentoId: validated.data.departamentoId,
        nome: validated.data.nome,
        descricao: validated.data.descricao || null,
      },
      perm.colaboradorId!,
    )
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao criar turno' }
  }

  revalidatePath('/turnos')
  redirect('/turnos')
}

export async function updateTurnoAction(
  prevState: TurnoActionState,
  formData: FormData,
): Promise<TurnoActionState> {
  const perm = await checkPermission('turnos.update')
  if (!perm.allowed) return { message: perm.error }

  const id = formData.get('id') as string
  if (!id) return { message: 'ID nao informado' }

  const raw = {
    departamentoId: formData.get('departamentoId') as string,
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string,
  }

  const validated = turnoUpdateSchema.safeParse(raw)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Dados invalidos' }
  }

  const supabase = await createClient()
  const repository = createTurnoRepository(supabase)
  const service = createTurnoService(repository)

  try {
    await service.update(id, validated.data, perm.colaboradorId!)
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao atualizar turno' }
  }

  revalidatePath('/turnos')
  redirect('/turnos')
}

export async function deleteTurnoAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('turnos.delete')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createTurnoRepository(supabase)
  const service = createTurnoService(repository)

  try {
    await service.softDelete(id, perm.colaboradorId!)
    revalidatePath('/turnos')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao excluir turno' }
  }
}

export async function restoreTurnoAction(id: string): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('turnos.delete')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createTurnoRepository(supabase)
  const service = createTurnoService(repository)

  try {
    await service.restore(id, perm.colaboradorId!)
    revalidatePath('/turnos')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao restaurar turno' }
  }
}

export async function toggleActiveTurnoAction(id: string, isActive: boolean): Promise<{ message?: string; success?: boolean }> {
  const perm = await checkPermission('turnos.update')
  if (!perm.allowed) return { message: perm.error }

  const supabase = await createClient()
  const repository = createTurnoRepository(supabase)
  const service = createTurnoService(repository)

  try {
    await service.setActive(id, isActive, perm.colaboradorId!)
    revalidatePath('/turnos')
    return { success: true }
  } catch (err) {
    return { message: err instanceof Error ? err.message : 'Erro ao alterar status' }
  }
}
