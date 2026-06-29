import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createSolicitacaoRepository } from '@/src/features/solicitacoes/repositories/solicitacao-repository'
import { createSolicitacaoService } from '@/src/features/solicitacoes/services/solicitacao-service'
import { SolicitacaoForm } from '@/src/features/solicitacoes/components/solicitacao-form'
import { createSolicitacaoAction } from '@/src/features/solicitacoes/actions/solicitacao-actions'
import { redirect } from 'next/navigation'

export default async function NovaSolicitacaoPage() {
  const colaborador = await getCurrentColaborador()

  if (!colaborador?.permissions.includes('solicitacoes.create')) {
    redirect('/solicitacoes')
  }

  const supabase = await createClient()
  const supabaseAdmin = await createAdminClient()
  const repository = createSolicitacaoRepository(supabase)
  const service = createSolicitacaoService(repository, supabaseAdmin)

  const [tiposFolga, turnos, datasBloqueadas] = await Promise.all([
    service.listTiposFolga(),
    service.listTurnos(),
    service.listDatasBloqueadas(),
  ])

  return (
    <div className="max-w-3xl mx-auto">
      <SolicitacaoForm
        action={createSolicitacaoAction}
        tiposFolga={tiposFolga}
        turnos={turnos}
        datasBloqueadas={datasBloqueadas}
        colaboradorId={colaborador.id}
      />
    </div>
  )
}
