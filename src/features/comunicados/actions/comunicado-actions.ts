'use server'

import { ComunicadoService } from '../services'
import { comunicadoSchema, comunicadoUpdateSchema } from '../schemas'
import type { ComunicadoActionState } from '../types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const service = new ComunicadoService()

export async function createComunicado(
  _prevState: ComunicadoActionState,
  formData: FormData
): Promise<ComunicadoActionState> {
  const raw = Object.fromEntries(formData)
  const parsed = comunicadoSchema.safeParse({
    ...raw,
    isPinned: raw.isPinned === 'true',
    prioridade: raw.prioridade || 'normal',
    audiencias: raw.audiencias ? JSON.parse(raw.audiencias as string) : [],
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, success: false }
  }

  try {
    const id = await service.create(parsed.data)
    revalidatePath('/comunicados')
    redirect(`/comunicados/${id}`)
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro ao criar comunicado', success: false }
  }
}

export async function updateComunicado(
  id: string,
  _prevState: ComunicadoActionState,
  formData: FormData
): Promise<ComunicadoActionState> {
  const raw = Object.fromEntries(formData)
  const parsed = comunicadoUpdateSchema.safeParse({
    ...raw,
    isPinned: raw.isPinned === 'true',
    audiencias: raw.audiencias ? JSON.parse(raw.audiencias as string) : undefined,
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, success: false }
  }

  try {
    await service.update(id, parsed.data)
    revalidatePath('/comunicados')
    revalidatePath(`/comunicados/${id}`)
    return { success: true, message: 'Comunicado atualizado com sucesso' }
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro inesperado', success: false }
  }
}

export async function archiveComunicado(id: string): Promise<ComunicadoActionState> {
  try {
    await service.archive(id)
    revalidatePath('/comunicados')
    revalidatePath(`/comunicados/${id}`)
    return { success: true, message: 'Comunicado arquivado com sucesso' }
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro inesperado', success: false }
  }
}

export async function restoreComunicado(id: string): Promise<ComunicadoActionState> {
  try {
    await service.restore(id)
    revalidatePath('/comunicados')
    revalidatePath(`/comunicados/${id}`)
    return { success: true, message: 'Comunicado restaurado com sucesso' }
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro inesperado', success: false }
  }
}

export async function deleteComunicado(id: string): Promise<ComunicadoActionState> {
  try {
    await service.delete(id)
    revalidatePath('/comunicados')
    return { success: true, message: 'Comunicado excluído com sucesso' }
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro inesperado', success: false }
  }
}

export async function markComunicadoAsRead(id: string): Promise<void> {
  await service.markAsRead(id)
}
