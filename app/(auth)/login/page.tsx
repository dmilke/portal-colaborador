import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Acessar plataforma</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Entre com seu email e senha
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
