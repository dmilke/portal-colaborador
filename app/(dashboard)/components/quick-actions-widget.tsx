import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Zap } from 'lucide-react'

interface QuickAction {
  label: string
  href: string
  permission?: string
}

const actions: QuickAction[] = [
  { label: 'Nova Solicitação', href: '/solicitacoes/nova' },
  { label: 'Novo Comunicado', href: '/comunicados/novo', permission: 'comunicados.create' },
  { label: 'Novo Documento', href: '/documentos/novo', permission: 'documentos.create' },
  { label: 'Novo Departamento', href: '/departamentos/novo', permission: 'departamentos.create' },
  { label: 'Novo Cargo', href: '/cargos/novo', permission: 'cargos.create' },
  { label: 'Nova Unidade', href: '/unidades/novo', permission: 'unidades.create' },
  { label: 'Novo Colaborador', href: '/colaboradores/novo', permission: 'colaboradores.create' },
]

export async function QuickActionsWidget() {
  const colaborador = await getCurrentColaborador()
  const permissions = colaborador?.permissions ?? []

  const visibleActions = actions.filter(
    (action) => !action.permission || permissions.includes(action.permission)
  )

  if (visibleActions.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {visibleActions.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
            >
              {label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
