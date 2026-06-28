'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminToolbar } from '@/src/shared/components/admin'
import { CargoTable } from '@/src/features/cargos/components/cargo-table'
import type { Cargo } from '@/src/features/cargos/types'

interface CargosPageContentProps {
  initialData: Cargo[]
  permissions: string[]
}

const tabs = [
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
  { value: 'all', label: 'Todos' },
]

export function CargosPageContent({ initialData, permissions }: CargosPageContentProps) {
  const router = useRouter()
  const [tab, setTab] = useState('active')

  const canCreate = permissions.includes('cargos.create')

  const filteredData = tab === 'all'
    ? initialData
    : tab === 'inactive'
      ? initialData.filter((c) => !c.isActive && !c.deletedAt)
      : initialData.filter((c) => !c.deletedAt)

  return (
    <div className="space-y-4">
      <AdminToolbar
        tabs={tabs}
        currentTab={tab}
        onTabChange={setTab}
        actionButton={canCreate ? { label: 'Novo Cargo', onClick: () => router.push('/cargos/novo') } : null}
      />

      <CargoTable
        data={filteredData}
        permissions={permissions}
        showDeleted={tab === 'all'}
        onDataChange={() => router.refresh()}
      />
    </div>
  )
}
