import { verifySession, getCurrentColaborador } from '@/src/shared/lib/auth'
import { DashboardContent } from './dashboard-content'

export default async function DashboardPage() {
  const user = await verifySession()
  const colaborador = await getCurrentColaborador()

  if (!colaborador) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Perfil não encontrado</p>
          <p className="text-sm text-muted-foreground">
            Seu usuário não está vinculado a um colaborador. Contate o administrador.
          </p>
        </div>
      </div>
    )
  }

  return (
    <DashboardContent
      colaborador={colaborador}
      user={{
        id: user.id,
        email: user.email,
        lastSignInAt: user.last_sign_in_at,
        createdAt: user.created_at,
      }}
    />
  )
}
