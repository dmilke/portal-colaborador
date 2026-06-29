'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Download,
  Archive,
  Trash2,
  RotateCcw,
  Send,
  FileText,
  Users,
  Clock,
} from 'lucide-react'
import { DocumentoStatusBadge } from './documento-status-badge'
import { DocumentoTypeBadge } from './documento-type-badge'
import { DocumentoVersionTimeline } from './documento-version-timeline'
import { AdminConfirmDialog } from '@/src/shared/components/admin'
import { toast } from 'sonner'
import type { Documento, DocumentoVersao, DocumentoLeitura } from '../types'
import {
  publishDocumento,
  archiveDocumento,
  restoreDocumento,
  deleteDocumento,
  markDocumentoAsRead,
  markDocumentoAsDownloaded,
} from '../actions'

interface Props {
  documento: Documento
  versions: DocumentoVersao[]
  leitores: DocumentoLeitura[]
  canUpdate: boolean
  canDelete: boolean
  canPublish: boolean
  canArchive: boolean
}

export function DocumentoDetail({
  documento,
  versions: initialVersions,
  leitores: initialLeitores,
  canDelete,
  canPublish,
  canArchive,
}: Props) {
  const router = useRouter()
  const [confirmAction, setConfirmAction] = useState<{ type: string } | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<DocumentoVersao | null>(null)
  const [leitores] = useState(initialLeitores)
  const [versions] = useState(initialVersions)

  useEffect(() => {
    if (!documento.lido) {
      markDocumentoAsRead(documento.id).catch(() => {})
    }
  }, [documento.id, documento.lido])

  const currentVersion = versions.find(v => v.isCurrent) ?? versions[0]

  async function handlePublish() {
    const result = await publishDocumento(documento.id)
    setConfirmAction(null)
    if (result?.success) {
      toast.success('Documento publicado')
      router.refresh()
    } else {
      toast.error(result?.message ?? 'Erro ao publicar')
    }
  }

  async function handleArchive() {
    const result = await archiveDocumento(documento.id)
    setConfirmAction(null)
    if (result?.success) {
      toast.success('Documento arquivado')
      router.refresh()
    } else {
      toast.error(result?.message ?? 'Erro ao arquivar')
    }
  }

  async function handleRestore() {
    const result = await restoreDocumento(documento.id)
    setConfirmAction(null)
    if (result?.success) {
      toast.success('Documento restaurado')
      router.refresh()
    } else {
      toast.error(result?.message ?? 'Erro ao restaurar')
    }
  }

  async function handleDelete() {
    const result = await deleteDocumento(documento.id)
    setConfirmAction(null)
    if (result?.success) {
      toast.success('Documento excluído')
      router.push('/documentos')
    } else {
      toast.error(result?.message ?? 'Erro ao excluir')
    }
  }

  async function handleDownload() {
    await markDocumentoAsDownloaded(documento.id)
    toast.success('Download registrado')
  }

  const isRascunho = documento.status === 'rascunho'
  const isPublicado = documento.status === 'publicado'
  const isArquivado = documento.status === 'arquivado'

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/documentos')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-2xl">{documento.titulo}</CardTitle>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <DocumentoStatusBadge status={documento.status} />
                <DocumentoTypeBadge tipo={documento.tipo} />
                {documento.categoria && (
                  <Badge variant="outline">{documento.categoria}</Badge>
                )}
                <span className="font-mono text-xs">v{documento.versaoAtual}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isRascunho && canPublish && (
                <Button size="sm" onClick={() => setConfirmAction({ type: 'publish' })}>
                  <Send className="mr-1 h-4 w-4" />
                  Publicar
                </Button>
              )}
              {isPublicado && canArchive && (
                <Button variant="outline" size="sm" onClick={() => setConfirmAction({ type: 'archive' })}>
                  <Archive className="mr-1 h-4 w-4" />
                  Arquivar
                </Button>
              )}
              {isArquivado && canArchive && (
                <Button variant="outline" size="sm" onClick={() => setConfirmAction({ type: 'restore' })}>
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Restaurar
                </Button>
              )}
              {canDelete && (
                <Button variant="outline" size="sm" onClick={() => setConfirmAction({ type: 'delete' })}>
                  <Trash2 className="mr-1 h-4 w-4 text-destructive" />
                  Excluir
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(documento.createdAt).toLocaleDateString('pt-BR')}
            </div>
            {documento.autorNome && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {documento.autorNome}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {documento.totalLeitores} leituras
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {documento.totalVersoes} versões
            </div>
            {documento.lido && (
              <Badge variant="outline" className="text-green-600">
                Lido em {new Date(documento.lidoEm!).toLocaleString('pt-BR')}
              </Badge>
            )}
          </div>

          <Separator />

          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="versions">Versões</TabsTrigger>
              <TabsTrigger value="audience">Público-alvo</TabsTrigger>
              <TabsTrigger value="leitores">Leitores ({leitores.length})</TabsTrigger>
              {documento.anexos.length > 0 && (
                <TabsTrigger value="attachments">Anexos ({documento.anexos.length})</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="content" className="mt-4 space-y-4">
              <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                {selectedVersion
                  ? (selectedVersion.descricao ?? documento.descricao ?? 'Sem descrição')
                  : (currentVersion?.descricao ?? documento.descricao ?? 'Sem descrição')
                }
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="versions" className="mt-4">
              <DocumentoVersionTimeline
                versions={versions}
                currentVersion={currentVersion?.versao ?? 0}
                onSelectVersion={setSelectedVersion}
              />
            </TabsContent>

            <TabsContent value="audience" className="mt-4">
              {documento.audiencias.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {documento.audiencias.map((a) => (
                    <Badge key={a.id} variant="secondary">
                      <Users className="mr-1 h-3 w-3" />
                      {a.tipo}: {a.alvoNome ?? a.alvoId.slice(0, 8)}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Visível para todos os colaboradores</p>
              )}
            </TabsContent>

            <TabsContent value="leitores" className="mt-4">
              {leitores.length > 0 ? (
                <div className="space-y-2">
                  {leitores.map((l) => (
                    <div key={l.colaboradorId} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{l.colaboradorNome ?? l.colaboradorId.slice(0, 8)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {new Date(l.lidoEm).toLocaleString('pt-BR')}
                        </span>
                        {l.downloadEm && (
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {new Date(l.downloadEm).toLocaleString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma leitura registrada</p>
              )}
            </TabsContent>

            {documento.anexos.length > 0 && (
              <TabsContent value="attachments" className="mt-4">
                <div className="space-y-2">
                  {documento.anexos.map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{a.nomeArquivo}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {a.mimeType && <span>{a.mimeType}</span>}
                        {a.tamanhoBytes && (
                          <span>{(a.tamanhoBytes / 1024).toFixed(1)} KB</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <AdminConfirmDialog
        open={confirmAction?.type === 'publish'}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Publicar documento"
        description="O documento será publicado e os colaboradores serão notificados."
        confirmLabel="Publicar"
        onConfirm={handlePublish}
      />

      <AdminConfirmDialog
        open={confirmAction?.type === 'archive'}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Arquivar documento"
        description="O documento será arquivado e não aparecerá mais na lista ativa."
        confirmLabel="Arquivar"
        onConfirm={handleArchive}
      />

      <AdminConfirmDialog
        open={confirmAction?.type === 'restore'}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Restaurar documento"
        description="O documento voltará a ficar ativo."
        confirmLabel="Restaurar"
        onConfirm={handleRestore}
      />

      <AdminConfirmDialog
        open={confirmAction?.type === 'delete'}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Excluir documento"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        confirmVariant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
