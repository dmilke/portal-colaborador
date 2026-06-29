'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminToolbar } from '@/src/shared/components/admin'
import { TurnoTable } from '@/src/features/turnos/components/turno-table'
import type { Turno } from '@/src/features/turnos/types'

interface TurnosPageContentProps {
  initialData: Turno[]
  permissions: string[]
}

const tabs = [
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
  { value: 'all', label: 'Todos' },
]

export function TurnosPageContent({ initialData, permissions }: TurnosPageContentProps) {
  const router = useRouter()
  const [tab, setTab] = useState('active')

  const canCreate = permissions.includes('turnos.create')

  const filteredData = tab === 'all'
    ? initialData
    : tab === 'inactive'
      ? initialData.filter((t) => !t.isActive && !t.deletedAt)
      : initialData.filter((t) => !t.deletedAt)

  return (
    <div className="space-y-4">
      <AdminToolbar
        tabs={tabs}
        currentTab={tab}
        onTabChange={setTab}
        actionButton={canCreate ? { label: 'Novo Turno', onClick: () => router.push('/turnos/novo') } : null}
      />

      <TurnoTable
        data={filteredData}
        permissions={permissions}
        showDeleted={tab === 'all'}
        onDataChange={() => router.refresh()}
      />
    </div>
  )
}
