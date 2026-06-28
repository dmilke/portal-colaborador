import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Zap } from 'lucide-react'

const actions = [
  { label: 'Novo Departamento', href: '/departamentos/novo' },
  { label: 'Novo Cargo', href: '/cargos/novo' },
  { label: 'Nova Unidade', href: '/unidades/novo' },
  { label: 'Novo Turno', href: '/turnos/novo' },
  { label: 'Novo Colaborador', href: '/colaboradores/novo' },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {actions.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background bg-clip-padding px-2.5 h-8 gap-1.5 text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
            >
              {label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
