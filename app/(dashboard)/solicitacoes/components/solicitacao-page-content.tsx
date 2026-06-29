'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminToolbar } from '@/src/shared/components/admin'
import { SolicitacaoTable } from '@/src/features/solicitacoes/components/solicitacao-table'
import type { Solicitacao } from '@/src/features/solicitacoes/types'

interface SolicitacaoPageContentProps {
  initialData: Solicitacao[]
  permissions: string[]
}

const tabs = [
  { value: 'all', label: 'Todas' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'aprovada', label: 'Aprovadas' },
  { value: 'reprovada', label: 'Reprovadas' },
  { value: 'cancelada', label: 'Canceladas' },
]

export function SolicitacaoPageContent({ initialData, permissions }: SolicitacaoPageContentProps) {
  const router = useRouter()
  const [tab, setTab] = useState('pendente')

  const canCreate = permissions.includes('solicitacoes.create')

  const filteredData = tab === 'all'
    ? initialData
    : initialData.filter((d) => d.status === tab)

  return (
    <div className="space-y-4">
      <AdminToolbar
        tabs={tabs}
        currentTab={tab}
        onTabChange={setTab}
        actionButton={canCreate ? { label: 'Nova Solicitação', onClick: () => router.push('/solicitacoes/nova') } : null}
      />

      <SolicitacaoTable
        data={filteredData}
        permissions={permissions}
        onDataChange={() => router.refresh()}
      />
    </div>
  )
}
