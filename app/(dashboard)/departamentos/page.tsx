import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createDepartamentoRepository } from '@/src/features/departamentos/repositories/departamento-repository'
import { createDepartamentoService } from '@/src/features/departamentos/services/departamento-service'
import { DepartamentoPageContent } from './components/departamento-page-content'
import { Skeleton } from '@/components/ui/skeleton'

export default async function DepartamentosPage() {
  const colaborador = await getCurrentColaborador()
  const supabase = await createClient()
  const repository = createDepartamentoRepository(supabase)
  const service = createDepartamentoService(repository)
  const departamentos = await service.list()
  const permissions = colaborador?.permissions ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Departamentos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os departamentos da organização
          </p>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <DepartamentoPageContent
          initialData={departamentos}
          permissions={permissions}
        />
      </Suspense>
    </div>
  )
}
