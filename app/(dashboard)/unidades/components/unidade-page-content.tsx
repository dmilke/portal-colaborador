'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminToolbar } from '@/src/shared/components/admin'
import { UnidadeTable } from '@/src/features/unidades/components/unidade-table'
import type { Unidade } from '@/src/features/unidades/types'

interface UnidadePageContentProps {
  initialData: Unidade[]
  permissions: string[]
}

const tabs = [
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
  { value: 'all', label: 'Todos' },
]

export function UnidadePageContent({ initialData, permissions }: UnidadePageContentProps) {
  const router = useRouter()
  const [tab, setTab] = useState('active')

  const canCreate = permissions.includes('unidades.create')

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
        actionButton={canCreate ? { label: 'Nova Unidade', onClick: () => router.push('/unidades/novo') } : null}
      />

      <UnidadeTable
        data={filteredData}
        permissions={permissions}
        showDeleted={tab === 'all'}
        onDataChange={() => router.refresh()}
      />
    </div>
  )
}
