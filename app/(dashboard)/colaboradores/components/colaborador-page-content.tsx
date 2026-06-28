'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminToolbar } from '@/src/shared/components/admin'
import { ColaboradorTable } from '@/src/features/colaboradores/components/colaborador-table'
import type { Colaborador } from '@/src/features/colaboradores/types'

interface ColaboradorPageContentProps {
  initialData: Colaborador[]
  permissions: string[]
}

const tabs = [
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
  { value: 'all', label: 'Todos' },
]

export function ColaboradorPageContent({ initialData, permissions }: ColaboradorPageContentProps) {
  const router = useRouter()
  const [tab, setTab] = useState('active')

  const canCreate = permissions.includes('colaboradores.create')

  const filteredData = tab === 'all'
    ? initialData
    : tab === 'inactive'
      ? initialData.filter((d) => !d.isActive && !d.deletedAt)
      : initialData.filter((d) => !d.deletedAt)

  return (
    <div className="space-y-4">
      <AdminToolbar
        tabs={tabs}
        currentTab={tab}
        onTabChange={setTab}
        actionButton={canCreate ? { label: 'Novo Colaborador', onClick: () => router.push('/colaboradores/novo') } : null}
      />

      <ColaboradorTable
        data={filteredData}
        permissions={permissions}
        showDeleted={tab === 'all'}
        onDataChange={() => router.refresh()}
      />
    </div>
  )
}
