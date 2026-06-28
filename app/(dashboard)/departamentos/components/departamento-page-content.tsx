'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DepartamentoTable } from '@/src/features/departamentos/components/departamento-table'
import { Plus } from 'lucide-react'
import type { Departamento } from '@/src/features/departamentos/types'

interface DepartamentoPageContentProps {
  initialData: Departamento[]
  permissions: string[]
}

export function DepartamentoPageContent({ initialData, permissions }: DepartamentoPageContentProps) {
  const router = useRouter()
  const [tab, setTab] = useState('active')

  const canCreate = permissions.includes('departamentos.create')

  const onDataChange = useCallback(() => {
    router.refresh()
  }, [router])

  const filteredData = tab === 'all'
    ? initialData
    : tab === 'inactive'
      ? initialData.filter((d) => !d.isActive && !d.deletedAt)
      : initialData.filter((d) => !d.deletedAt)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>
        </Tabs>

        {canCreate && (
          <Button onClick={() => router.push('/departamentos/novo')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Departamento
          </Button>
        )}
      </div>

      <DepartamentoTable
        data={filteredData}
        permissions={permissions}
        showDeleted={tab === 'all'}
        onDataChange={onDataChange}
      />
    </div>
  )
}
