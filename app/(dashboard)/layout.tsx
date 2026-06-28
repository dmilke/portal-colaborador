import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { DashboardShell } from '@/src/shared/components/dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const colaborador = await getCurrentColaborador()

  return (
    <DashboardShell colaborador={colaborador}>
      {children}
    </DashboardShell>
  )
}
