'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminToolbar } from '@/src/shared/components/admin'
import { DocumentoTable } from '@/src/features/documentos/components/documento-table'
import type { Documento } from '@/src/features/documentos/types'

interface Props {
  initialData: Documento[]
  permissions: string[]
}

const tabs = [
  { value: 'all', label: 'Todos' },
  { value: 'publicado', label: 'Publicados' },
  { value: 'rascunho', label: 'Rascunhos' },
  { value: 'arquivado', label: 'Arquivados' },
]

export function DocumentosPageContent({ initialData, permissions }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState('all')

  const canCreate = permissions.includes('documentos.create')

  const filteredData = tab === 'all'
    ? initialData
    : initialData.filter((d) => d.status === tab)

  return (
    <div className="space-y-4">
      <AdminToolbar
        tabs={tabs}
        currentTab={tab}
        onTabChange={setTab}
        actionButton={canCreate ? { label: 'Novo Documento', onClick: () => router.push('/documentos/novo') } : null}
      />
      <DocumentoTable data={filteredData} />
    </div>
  )
}
