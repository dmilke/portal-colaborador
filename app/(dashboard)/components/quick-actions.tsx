import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
            <Button key={href} variant="outline" onClick={() => window.location.href = href}>
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
