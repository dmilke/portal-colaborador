import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { gestaoService } from '@/src/features/gestao'
import type { GestaoFilters } from '@/src/features/gestao/types'
import { GestaoHeader } from './components/gestao-header'
import { CollaboratorIndicators } from './components/collaborator-indicators'
import { SolicitacaoIndicators } from './components/solicitacao-indicators'
import { ComunicadoIndicators } from './components/comunicado-indicators'
import { DocumentoIndicators } from './components/documento-indicators'
import { NotificacaoIndicators } from './components/notificacao-indicators'
import { OperationalCards } from './components/operational-cards'
import { SolicitacaoCharts } from './components/solicitacao-charts'
import { ComunicadoCharts } from './components/comunicado-charts'
import { DocumentoCharts } from './components/documento-charts'
import { NotificacaoCharts } from './components/notificacao-charts'
import { GestaoFiltersBar } from './components/gestao-filters-bar'
import { ExportBar } from './components/export-bar'
import { GestaoSkeleton } from './components/gestao-skeleton'

interface GestaoPageProps {
  searchParams: Promise<{
    departamento?: string
    unidade?: string
    cargo?: string
    dateFrom?: string
    dateTo?: string
  }>
}

export default async function GestaoPage({ searchParams }: GestaoPageProps) {
  const colaborador = await getCurrentColaborador()

  if (!colaborador || !colaborador.permissions.includes('gestao.read')) {
    redirect('/')
  }

  const params = await searchParams
  const filters: GestaoFilters = {
    departamentoId: params.departamento,
    unidadeId: params.unidade,
    cargoId: params.cargo,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  }

  const data = await gestaoService.getData(filters)

  return (
    <div className="space-y-6">
      <GestaoHeader />

      <GestaoFiltersBar
        currentFilters={{
          departamentoId: params.departamento,
          unidadeId: params.unidade,
          cargoId: params.cargo,
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
        }}
      />

      <ExportBar data={data} />

      <Suspense fallback={<GestaoSkeleton />}>
        <OperationalCards data={data.operational} />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <CollaboratorIndicators data={data.collaborators} />
        <SolicitacaoIndicators data={data.solicitacoes} />
        <ComunicadoIndicators data={data.comunicados} />
        <DocumentoIndicators data={data.documentos} />
        <NotificacaoIndicators data={data.notificacoes} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SolicitacaoCharts data={data.solicitacoes} />
        <ComunicadoCharts data={data.comunicados} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DocumentoCharts data={data.documentos} />
        <NotificacaoCharts data={data.notificacoes} />
      </div>
    </div>
  )
}
