export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-muted/20 pointer-events-none" />
      <div className="relative w-full max-w-md px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground text-lg font-bold mb-4">
            PC
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Portal do Colaborador
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie suas solicitações de folga
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
