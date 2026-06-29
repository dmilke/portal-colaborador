import { DocumentoRepository } from '../repositories'
import type {
  Documento,
  DocumentoVersao,
  DocumentoLeitura,
  CreateDocumentoInput,
  UpdateDocumentoInput,
  DocumentoListParams,
  DocumentoListResult,
} from '../types'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { checkPermission } from '@/src/shared/lib/permissions'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { dispatch, emit, initializeEventHandlers } from '@/src/features/eventos'

initializeEventHandlers()

export class DocumentoService {
  private repo = new DocumentoRepository()

  async list(params: DocumentoListParams): Promise<DocumentoListResult> {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10

    const { data, total } = await this.repo.findAll({
      search: params.search,
      status: params.status,
      tipo: params.tipo,
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

  async getById(id: string): Promise<Documento | null> {
    const currentUser = await getCurrentColaborador()
    return this.repo.findWithDetails(id, currentUser?.id ?? '')
  }

  async create(input: CreateDocumentoInput): Promise<string> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const perm = await checkPermission('documentos.create')
    if (!perm.allowed) throw new Error('Sem permissão para criar documentos')

    const id = await this.repo.create({
      titulo: input.titulo,
      descricao: input.descricao || null,
      tipo: input.tipo,
      categoria: input.categoria || null,
      status: input.status || 'rascunho',
      colaboradorId: currentUser.id,
      departamentoId: input.departamentoId ?? null,
      unidadeId: input.unidadeId ?? null,
      publicacaoEm: input.publicacaoEm ?? null,
      expiracaoEm: input.expiracaoEm ?? null,
      createdBy: currentUser.id,
    })

    await this.repo.createInitialVersion({
      documentoId: id,
      titulo: input.titulo,
      descricao: input.descricao,
      createdBy: currentUser.id,
    })

    await this.repo.saveAudiencias(id, input.audiencias)

    await this.audit(id, 'cadastro', 'Documento criado', currentUser.id)

    return id
  }

  async update(id: string, input: UpdateDocumentoInput): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const perm = await checkPermission('documentos.update')
    if (!perm.allowed) throw new Error('Sem permissão para editar documentos')

    const existing = await this.repo.findById(id)
    if (!existing) throw new Error('Documento não encontrado')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = { updated_by: currentUser.id }

    if (input.titulo !== undefined) {
      updates.titulo = input.titulo
      await this.repo.createNewVersion(id, {
        titulo: input.titulo,
        descricao: input.descricao !== undefined ? input.descricao : existing.descricao,
        createdBy: currentUser.id,
      })
    }
    if (input.descricao !== undefined && input.titulo === undefined) {
      updates.descricao = input.descricao || null
      await this.repo.createNewVersion(id, {
        descricao: input.descricao,
        createdBy: currentUser.id,
      })
    }
    if (input.tipo !== undefined) updates.tipo = input.tipo
    if (input.categoria !== undefined) updates.categoria = input.categoria || null
    if (input.status !== undefined) updates.status = input.status
    if (input.colaboradorId !== undefined) updates.colaborador_id = input.colaboradorId || null
    if (input.departamentoId !== undefined) updates.departamento_id = input.departamentoId || null
    if (input.unidadeId !== undefined) updates.unidade_id = input.unidadeId || null
    if (input.publicacaoEm !== undefined) updates.publicacao_em = input.publicacaoEm || null
    if (input.expiracaoEm !== undefined) updates.expiracao_em = input.expiracaoEm || null

    await this.repo.update(id, updates)

    if (input.audiencias !== undefined) {
      await this.repo.saveAudiencias(id, input.audiencias)
    }

    await this.audit(id, 'alteracao', 'Documento atualizado', currentUser.id)
  }

  async publish(id: string): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const perm = await checkPermission('documentos.publish')
    if (!perm.allowed) throw new Error('Sem permissão para publicar documentos')

    const doc = await this.repo.findById(id)
    if (!doc) throw new Error('Documento não encontrado')

    await this.repo.setStatus(id, 'publicado', currentUser.id)
    await this.repo.update(id, {
      publicacao_em: new Date().toISOString(),
      updated_by: currentUser.id,
    })

    await this.notifyColaboradores(id, 'Documento publicado', `O documento "${doc.titulo}" foi publicado.`)
    await this.audit(id, 'alteracao', 'Documento publicado', currentUser.id)

    await dispatch(emit('documento.published', 'documentos', {
      documentoId: id,
      titulo: doc.titulo,
      autorId: currentUser.id,
    }, currentUser.id))
  }

  async archive(id: string): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const perm = await checkPermission('documentos.archive')
    if (!perm.allowed) throw new Error('Sem permissão para arquivar documentos')

    await this.repo.setStatus(id, 'arquivado', currentUser.id)
    await this.audit(id, 'alteracao', 'Documento arquivado', currentUser.id)
  }

  async restore(id: string): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const perm = await checkPermission('documentos.archive')
    if (!perm.allowed) throw new Error('Sem permissão para restaurar documentos')

    await this.repo.setStatus(id, 'rascunho', currentUser.id)
    await this.repo.setActive(id, true, currentUser.id)
    await this.audit(id, 'alteracao', 'Documento restaurado', currentUser.id)
  }

  async delete(id: string): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')

    const perm = await checkPermission('documentos.delete')
    if (!perm.allowed) throw new Error('Sem permissão para excluir documentos')

    await this.repo.softDelete(id, currentUser.id)
    await this.audit(id, 'alteracao', 'Documento excluído', currentUser.id)
  }

  async markAsRead(id: string): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')
    await this.repo.markAsRead(id, currentUser.id)

    await dispatch(emit('documento.read', 'documentos', {
      documentoId: id,
      titulo: '',
    }, currentUser.id))
  }

  async markAsDownloaded(id: string): Promise<void> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) throw new Error('Usuário não autenticado')
    await this.repo.markAsDownloaded(id, currentUser.id)

    await dispatch(emit('documento.downloaded', 'documentos', {
      documentoId: id,
      titulo: '',
    }, currentUser.id))
  }

  async getVersions(documentoId: string): Promise<DocumentoVersao[]> {
    return this.repo.getVersions(documentoId)
  }

  async getVersion(id: string): Promise<DocumentoVersao | null> {
    return this.repo.getVersion(id)
  }

  async getLeitores(documentoId: string): Promise<DocumentoLeitura[]> {
    return this.repo.getLeitores(documentoId)
  }

  async getPublishedCount(): Promise<number> {
    return this.repo.countPublished()
  }

  async getPendingReadsCount(): Promise<number> {
    const currentUser = await getCurrentColaborador()
    if (!currentUser) return 0
    return this.repo.countPendingReads(currentUser.id)
  }

  async getRecentCount(days = 7): Promise<number> {
    return this.repo.countRecent(days)
  }

  private async notifyColaboradores(
    documentoId: string,
    titulo: string,
    mensagem: string
  ): Promise<void> {
    const supabase = await createClient()
    const admin = await createAdminClient()

    const { data: audiencias } = await supabase
      .from('audiencias')
      .select('alvo_id, tipo')
      .eq('entidade_tipo', 'documento')
      .eq('entidade_id', documentoId)

    let colaboradorIds: string[] = []

    if (!audiencias || audiencias.length === 0) {
      const { data: allColabs } = await supabase
        .from('colaboradores')
        .select('id')
        .is('deleted_at', null)
      colaboradorIds = (allColabs ?? []).map((c: { id: string }) => c.id)
    } else {
      for (const a of audiencias) {
        if (a.tipo === 'colaborador') {
          colaboradorIds.push(a.alvo_id as string)
        } else if (a.tipo === 'departamento') {
          const { data: colabs } = await supabase
            .from('colaboradores')
            .select('id')
            .eq('departamento_id', a.alvo_id)
            .is('deleted_at', null)
          colaboradorIds.push(...(colabs ?? []).map((c: { id: string }) => c.id))
        } else if (a.tipo === 'unidade') {
          const { data: colabs } = await supabase
            .from('colaboradores')
            .select('id')
            .eq('unidade_id', a.alvo_id)
            .is('deleted_at', null)
          colaboradorIds.push(...(colabs ?? []).map((c: { id: string }) => c.id))
        }
      }
    }

    colaboradorIds = [...new Set(colaboradorIds)]

    if (colaboradorIds.length > 0) {
      const notifications = colaboradorIds.map((colaboradorId) => ({
        colaborador_id: colaboradorId,
        titulo,
        mensagem,
        tipo: 'documento',
        payload: { documento_id: documentoId },
      }))

      await admin.from('notificacoes').insert(notifications)
    }
  }

  private async audit(
    entidadeId: string,
    acao: string,
    descricao: string,
    colaboradorId: string
  ): Promise<void> {
    const admin = await createAdminClient()
    await admin.from('auditoria').insert({
      colaborador_id: colaboradorId,
      acao,
      entidade_tipo: 'documento',
      entidade_id: entidadeId,
      descricao,
    })
  }
}
