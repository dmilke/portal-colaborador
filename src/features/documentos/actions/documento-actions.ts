'use server'

import { DocumentoService } from '../services'
import { documentoSchema, documentoUpdateSchema } from '../schemas'
import type { DocumentoActionState } from '../types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const service = new DocumentoService()

export async function createDocumento(
  _prevState: DocumentoActionState,
  formData: FormData
): Promise<DocumentoActionState> {
  const raw = Object.fromEntries(formData)
  const parsed = documentoSchema.safeParse({
    ...raw,
    audiencias: raw.audiencias ? JSON.parse(raw.audiencias as string) : [],
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, success: false }
  }

  try {
    const id = await service.create(parsed.data)
    revalidatePath('/documentos')
    redirect(`/documentos/${id}`)
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro ao criar documento', success: false }
  }
}

export async function updateDocumento(
  id: string,
  _prevState: DocumentoActionState,
  formData: FormData
): Promise<DocumentoActionState> {
  const raw = Object.fromEntries(formData)
  const parsed = documentoUpdateSchema.safeParse({
    ...raw,
    audiencias: raw.audiencias ? JSON.parse(raw.audiencias as string) : undefined,
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, success: false }
  }

  try {
    await service.update(id, parsed.data)
    revalidatePath('/documentos')
    revalidatePath(`/documentos/${id}`)
    return { success: true, message: 'Documento atualizado com sucesso' }
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro ao atualizar documento', success: false }
  }
}

export async function publishDocumento(id: string): Promise<DocumentoActionState> {
  try {
    await service.publish(id)
    revalidatePath('/documentos')
    revalidatePath(`/documentos/${id}`)
    return { success: true, message: 'Documento publicado com sucesso' }
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro ao publicar documento', success: false }
  }
}

export async function archiveDocumento(id: string): Promise<DocumentoActionState> {
  try {
    await service.archive(id)
    revalidatePath('/documentos')
    revalidatePath(`/documentos/${id}`)
    return { success: true, message: 'Documento arquivado com sucesso' }
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro ao arquivar documento', success: false }
  }
}

export async function restoreDocumento(id: string): Promise<DocumentoActionState> {
  try {
    await service.restore(id)
    revalidatePath('/documentos')
    revalidatePath(`/documentos/${id}`)
    return { success: true, message: 'Documento restaurado com sucesso' }
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro ao restaurar documento', success: false }
  }
}

export async function deleteDocumento(id: string): Promise<DocumentoActionState> {
  try {
    await service.delete(id)
    revalidatePath('/documentos')
    return { success: true, message: 'Documento excluído com sucesso' }
  } catch (err: unknown) {
    return { message: err instanceof Error ? err.message : 'Erro ao excluir documento', success: false }
  }
}

export async function markDocumentoAsRead(id: string): Promise<void> {
  await service.markAsRead(id)
}

export async function markDocumentoAsDownloaded(id: string): Promise<void> {
  await service.markAsDownloaded(id)
}
