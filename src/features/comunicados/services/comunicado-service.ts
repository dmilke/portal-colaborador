import { ComunicadoRepository } from '../repositories'
import type {
  Comunicado,
  ComunicadoAudiencia,
  CreateComunicadoInput,
  UpdateComunicadoInput,
  ComunicadoListParams,
  ComunicadoListResult,
} from '../types'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { checkPermission } from '@/src/shared/lib/permissions'
import { dispatch, emit, initializeEventHandlers } from '@/src/features/eventos'

initializeEventHandlers()

export class ComunicadoService {
  private repo = new ComunicadoRepository()

  async list(params: ComunicadoListParams): Promise<ComunicadoListResult> {
    const currentUser = await getCurrentColaborador()
    const colaboradorId = currentUser?.id

    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10

    const { data, total } = await this.repo.findAll({
      search: params.search,
      status: params.status,
      categoria: params.categoria,
      prioridade: params.prioridade,
      colaboradorId,
      page,
      pageSize,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    })

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  async getById(id: string): Promise<Comunicado | null> {
    const currentUser = await getCurrentColaborador()
    const colaboradorId = currentUser?.id
    return this.repo.findWithDetails(id, colaboradorId ?? '')
  }

  async create(input: CreateComunicadoInput): Promise<string> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const perm = await checkPermission('comunicados.create')
    if (!perm.allowed) throw new Error('Sem permissão para criar comunicados')

    const id = await this.repo.create({
      titulo: input.titulo,
      conteudo: input.conteudo,
      autorId: currentUser.id,
      categoria: input.categoria || null,
      prioridade: input.prioridade,
      isPinned: input.isPinned,
      departamentoId: input.departamentoId ?? null,
      unidadeId: input.unidadeId ?? null,
      publicacaoEm: input.publicacaoEm ?? null,
      expiracaoEm: input.expiracaoEm ?? null,
      createdBy: currentUser.id,
    })

    await this.repo.saveAudiencias(id, input.audiencias)

    await dispatch(emit('comunicado.published', 'comunicados', {
      comunicadoId: id,
      titulo: input.titulo,
      autorId: currentUser.id,
    }, currentUser.id))

    return id
  }

  async update(id: string, input: UpdateComunicadoInput): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const updatePerm = await checkPermission('comunicados.update')
    if (!updatePerm.allowed) throw new Error('Sem permissão para editar comunicados')

    const existing = await this.repo.findById(id)
    if (!existing) throw new Error('Comunicado não encontrado')

    const updates: Record<string, unknown> = { updated_by: currentUser.id }

    if (input.titulo !== undefined) updates.titulo = input.titulo
    if (input.conteudo !== undefined) updates.conteudo = input.conteudo
    if (input.categoria !== undefined) updates.categoria = input.categoria || null
    if (input.prioridade !== undefined) updates.prioridade = input.prioridade
    if (input.isPinned !== undefined) updates.is_pinned = input.isPinned
    if (input.departamentoId !== undefined) updates.departamento_id = input.departamentoId || null
    if (input.unidadeId !== undefined) updates.unidade_id = input.unidadeId || null
    if (input.publicacaoEm !== undefined) updates.publicacao_em = input.publicacaoEm || null
    if (input.expiracaoEm !== undefined) updates.expiracao_em = input.expiracaoEm || null

    await this.repo.update(id, updates)

    if (input.audiencias !== undefined) {
      await this.repo.saveAudiencias(id, input.audiencias)
    }
  }

  async archive(id: string): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const archivePerm = await checkPermission('comunicados.update')
    if (!archivePerm.allowed) throw new Error('Sem permissão para arquivar comunicados')

    await this.repo.setActive(id, false, currentUser.id)
  }

  async restore(id: string): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const restorePerm = await checkPermission('comunicados.update')
    if (!restorePerm.allowed) throw new Error('Sem permissão para restaurar comunicados')

    await this.repo.setActive(id, true, currentUser.id)
  }

  async delete(id: string): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const deletePerm = await checkPermission('comunicados.delete')
    if (!deletePerm.allowed) throw new Error('Sem permissão para excluir comunicados')

    await this.repo.softDelete(id, currentUser.id)
  }

  async markAsRead(id: string): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    await this.repo.markAsRead(id, currentUser.id)

    await dispatch(emit('comunicado.read', 'comunicados', {
      comunicadoId: id,
      titulo: '',
    }, currentUser.id))
  }

  async getAudiencias(comunicadoId: string): Promise<ComunicadoAudiencia[]> {
    return this.repo.findAudiencias(comunicadoId)
  }

  async getLeitoresCount(comunicadoId: string): Promise<number> {
    return this.repo.countLeitores(comunicadoId)
  }

  async getActiveCount(): Promise<number> {
    return this.repo.count()
  }

  async getUnreadCount(): Promise<number> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) return 0
    return this.repo.countUnread(currentUser.id)
  }
}
