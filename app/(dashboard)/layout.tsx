import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { DashboardShell } from '@/src/shared/components/dashboard-shell'
import { notificacaoService } from '@/src/features/notificacoes/services/notificacao-service'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [colaborador, unreadCount] = await Promise.all([
    getCurrentColaborador(),
    notificacaoService.getUnreadCount(),
  ])

  return (
    <DashboardShell colaborador={colaborador} unreadCount={unreadCount}>
      {children}
    </DashboardShell>
  )
}
