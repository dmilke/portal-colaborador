'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminToolbar } from '@/src/shared/components/admin'
import { DepartamentoTable } from '@/src/features/departamentos/components/departamento-table'
import type { Departamento } from '@/src/features/departamentos/types'

interface DepartamentoPageContentProps {
  initialData: Departamento[]
  permissions: string[]
}

const tabs = [
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
  { value: 'all', label: 'Todos' },
]

export function DepartamentoPageContent({ initialData, permissions }: DepartamentoPageContentProps) {
  const router = useRouter()
  const [tab, setTab] = useState('active')

  const canCreate = permissions.includes('departamentos.create')

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
        actionButton={canCreate ? { label: 'Novo Departamento', onClick: () => router.push('/departamentos/novo') } : null}
      />

      <DepartamentoTable
        data={filteredData}
        permissions={permissions}
        showDeleted={tab === 'all'}
        onDataChange={() => router.refresh()}
      />
    </div>
  )
}
