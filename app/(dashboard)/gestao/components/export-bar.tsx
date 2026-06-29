'use client'

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react'
import type { GestaoData } from '@/src/features/gestao/types'

export function ExportBar({ data }: { data: GestaoData }) {
  const exportCSV = useCallback(() => {
    const rows = [
      ['Categoria', 'Métrica', 'Valor'],
      ['Colaboradores', 'Total', String(data.collaborators.total)],
      ['Colaboradores', 'Ativos', String(data.collaborators.active)],
      ['Colaboradores', 'Inativos', String(data.collaborators.inactive)],
      ['Colaboradores', 'Último login (24h)', String(data.collaborators.lastLogin)],
      ['Colaboradores', 'Nunca logaram', String(data.collaborators.neverLogged)],
      ['', '', ''],
      ['Solicitações', 'Pendentes', String(data.solicitacoes.pending)],
      ['Solicitações', 'Aprovadas', String(data.solicitacoes.approved)],
      ['Solicitações', 'Reprovadas', String(data.solicitacoes.rejected)],
      ['Solicitações', 'Canceladas', String(data.solicitacoes.cancelled)],
      ['Solicitações', 'Tempo médio (h)', String(data.solicitacoes.avgApprovalHours ?? '—')],
      ['', '', ''],
      ['Comunicados', 'Publicados', String(data.comunicados.published)],
      ['Comunicados', 'Não lidos', String(data.comunicados.unread)],
      ['Comunicados', 'Taxa de leitura %', String(data.comunicados.readRate)],
      ['', '', ''],
      ['Documentos', 'Publicados', String(data.documentos.published)],
      ['Documentos', 'Pendentes leitura', String(data.documentos.pendingReading)],
      ['Documentos', 'Taxa de leitura %', String(data.documentos.readRate)],
      ['Documentos', 'Downloads', String(data.documentos.downloads)],
      ['', '', ''],
      ['Notificações', 'Não lidas', String(data.notificacoes.unread)],
      ['Notificações', 'Lidas', String(data.notificacoes.read)],
      ['', '', ''],
      ['Operacional', 'Usuários online', String(data.operational.usersOnline)],
      ['Operacional', 'Ações pendentes', String(data.operational.pendingActions)],
      ['Operacional', 'Docs expirados', String(data.operational.expiredDocuments)],
      ['Operacional', 'Comunicados expirados', String(data.operational.expiredCommunications)],
    ]

    const csv = rows.map((r) => r.join(',')).join('\n')
    downloadFile(csv, 'gestao-indicadores.csv', 'text/csv')
  }, [data])

  const exportExcel = useCallback(async () => {
    const XLSX = await import('xlsx')

    const wb = XLSX.utils.book_new()

    const indicatorsData = [
      ['Categoria', 'Métrica', 'Valor'],
      ['Colaboradores', 'Total', data.collaborators.total],
      ['Colaboradores', 'Ativos', data.collaborators.active],
      ['Colaboradores', 'Inativos', data.collaborators.inactive],
      ['Solicitações', 'Pendentes', data.solicitacoes.pending],
      ['Solicitações', 'Aprovadas', data.solicitacoes.approved],
      ['Solicitações', 'Reprovadas', data.solicitacoes.rejected],
      ['Solicitações', 'Canceladas', data.solicitacoes.cancelled],
      ['Comunicados', 'Publicados', data.comunicados.published],
      ['Comunicados', 'Não lidos', data.comunicados.unread],
      ['Documentos', 'Publicados', data.documentos.published],
      ['Documentos', 'Downloads', data.documentos.downloads],
      ['Notificações', 'Não lidas', data.notificacoes.unread],
      ['Notificações', 'Lidas', data.notificacoes.read],
    ]

    const ws1 = XLSX.utils.aoa_to_sheet(indicatorsData)
    XLSX.utils.book_append_sheet(wb, ws1, 'Indicadores')

    const monthlyData = [
      ['Mês', 'Solicitações', 'Comunicados', 'Documentos'],
      ...data.solicitacoes.monthly.map((s, i) => [
        s.month,
        s.count,
        data.comunicados.monthly[i]?.count ?? 0,
        data.documentos.monthly[i]?.count ?? 0,
      ]),
    ]
    const ws2 = XLSX.utils.aoa_to_sheet(monthlyData)
    XLSX.utils.book_append_sheet(wb, ws2, 'Mensal')

    const deptData = [
      ['Departamento', 'Solicitações'],
      ...data.solicitacoes.byDepartment.map((d) => [d.name, d.count]),
    ]
    const ws3 = XLSX.utils.aoa_to_sheet(deptData)
    XLSX.utils.book_append_sheet(wb, ws3, 'Por Departamento')

    XLSX.writeFile(wb, 'gestao-indicadores.xlsx')
  }, [data])

  const exportPDF = useCallback(() => {
    const lines = [
      'CENTRO DE GESTÃO — INDICADORES',
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      '',
      '=== COLABORADORES ===',
      `Total: ${data.collaborators.total}`,
      `Ativos: ${data.collaborators.active}`,
      `Inativos: ${data.collaborators.inactive}`,
      `Último login (24h): ${data.collaborators.lastLogin}`,
      `Nunca logaram: ${data.collaborators.neverLogged}`,
      '',
      '=== SOLICITAÇÕES ===',
      `Pendentes: ${data.solicitacoes.pending}`,
      `Aprovadas: ${data.solicitacoes.approved}`,
      `Reprovadas: ${data.solicitacoes.rejected}`,
      `Canceladas: ${data.solicitacoes.cancelled}`,
      `Tempo médio: ${data.solicitacoes.avgApprovalHours ?? '—'}h`,
      '',
      '=== COMUNICADOS ===',
      `Publicados: ${data.comunicados.published}`,
      `Não lidos: ${data.comunicados.unread}`,
      `Taxa de leitura: ${data.comunicados.readRate}%`,
      '',
      '=== DOCUMENTOS ===',
      `Publicados: ${data.documentos.published}`,
      `Pendentes leitura: ${data.documentos.pendingReading}`,
      `Taxa de leitura: ${data.documentos.readRate}%`,
      `Downloads: ${data.documentos.downloads}`,
      '',
      '=== NOTIFICAÇÕES ===',
      `Não lidas: ${data.notificacoes.unread}`,
      `Lidas: ${data.notificacoes.read}`,
      '',
      '=== OPERACIONAL ===',
      `Usuários online: ${data.operational.usersOnline}`,
      `Ações pendentes: ${data.operational.pendingActions}`,
      `Documentos expirados: ${data.operational.expiredDocuments}`,
      `Comunicados expirados: ${data.operational.expiredCommunications}`,
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gestao-indicadores.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Download className="h-3.5 w-3.5" />
        Exportar:
      </span>
      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={exportCSV}>
        <FileText className="h-3.5 w-3.5 mr-1" />
        CSV
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={exportExcel}>
        <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
        Excel
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={exportPDF}>
        <File className="h-3.5 w-3.5 mr-1" />
        PDF
      </Button>
    </div>
  )
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
