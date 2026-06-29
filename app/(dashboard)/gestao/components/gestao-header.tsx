import { BarChart3 } from 'lucide-react'

export function GestaoHeader() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        Centro de Gestão
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Indicadores operacionais e analíticos do portal
      </p>
    </div>
  )
}
