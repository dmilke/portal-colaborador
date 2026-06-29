'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminToolbar } from '@/src/shared/components/admin'
import { ComunicadoTable } from '@/src/features/comunicados/components/comunicado-table'
import type { Comunicado } from '@/src/features/comunicados/types'

interface Props {
  initialData: Comunicado[]
  permissions: string[]
}

const tabs = [
  { value: 'active', label: 'Ativos' },
  { value: 'archived', label: 'Arquivados' },
  { value: 'all', label: 'Todos' },
]

export function ComunicadosPageContent({ initialData, permissions }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState('active')

  const canCreate = permissions.includes('comunicados.create')

  const filteredData = tab === 'all'
    ? initialData
    : initialData.filter((d) => tab === 'active' ? d.isActive : !d.isActive)

  return (
    <div className="space-y-4">
      <AdminToolbar
        tabs={tabs}
        currentTab={tab}
        onTabChange={setTab}
        actionButton={canCreate ? { label: 'Novo Comunicado', onClick: () => router.push('/comunicados/novo') } : null}
      />
      <ComunicadoTable data={filteredData} />
    </div>
  )
}
