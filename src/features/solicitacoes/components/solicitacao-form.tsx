'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import type { Solicitacao, TipoFolga, Turno, DataBloqueada, SolicitacaoActionState } from '../types'

interface SolicitacaoFormProps {
  action: (prevState: SolicitacaoActionState, formData: FormData) => Promise<SolicitacaoActionState>
  solicitacao?: Solicitacao
  tiposFolga: TipoFolga[]
  turnos: Turno[]
  datasBloqueadas: DataBloqueada[]
  colaboradorId: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      Salvar
    </Button>
  )
}

export function SolicitacaoForm({ action, solicitacao, tiposFolga, turnos, datasBloqueadas, colaboradorId }: SolicitacaoFormProps) {
  const [state, formAction] = useActionState<SolicitacaoActionState, FormData>(action, null)
  const [selectedDate, setSelectedDate] = useState(solicitacao?.dataFolga ?? '')
  const isEditing = !!solicitacao

  const blockedDates = datasBloqueadas.map((d) => d.data)
  const isDateBlocked = selectedDate ? blockedDates.includes(selectedDate) : false

  const isFutureDate = (dateStr: string) => {
    if (!dateStr) return true
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }

  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Solicitação' : 'Nova Solicitação de Folga'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Altere os dados da solicitação'
            : 'Preencha os dados para solicitar uma folga'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {solicitacao && <input type="hidden" name="id" value={solicitacao.id} />}
          <input type="hidden" name="colaboradorId" value={colaboradorId} />

          {state?.message && !state.errors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoFolgaId">
                Tipo de Folga <span className="text-red-500">*</span>
              </Label>
              <select
                id="tipoFolgaId"
                name="tipoFolgaId"
                defaultValue={solicitacao?.tipoFolgaId ?? ''}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                required
              >
                <option value="">Selecione...</option>
                {tiposFolga.map((t) => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
              {state?.errors?.tipoFolgaId && (
                <p className="text-sm text-red-500">{state.errors.tipoFolgaId[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="turnoId">
                Turno <span className="text-red-500">*</span>
              </Label>
              <select
                id="turnoId"
                name="turnoId"
                defaultValue={solicitacao?.turnoId ?? ''}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                required
              >
                <option value="">Selecione...</option>
                {turnos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.departamentoNome ? `${t.nome} (${t.departamentoNome})` : t.nome}
                  </option>
                ))}
              </select>
              {state?.errors?.turnoId && (
                <p className="text-sm text-red-500">{state.errors.turnoId[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFolga">
                Data da Folga <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dataFolga"
                name="dataFolga"
                type="date"
                defaultValue={solicitacao?.dataFolga ?? ''}
                min={today}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {state?.errors?.dataFolga && (
                <p className="text-sm text-red-500">{state.errors.dataFolga[0]}</p>
              )}
              {isDateBlocked && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  Esta data está bloqueada para solicitações
                </p>
              )}
              {selectedDate && !isFutureDate(selectedDate) && (
                <p className="text-sm text-red-500">
                  A data deve ser hoje ou futura
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="justificativa">Justificativa</Label>
            <textarea
              id="justificativa"
              name="justificativa"
              defaultValue={solicitacao?.justificativa ?? ''}
              rows={4}
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-y"
              placeholder="Descreva o motivo da solicitação (opcional)"
            />
            {state?.errors?.justificativa && (
              <p className="text-sm text-red-500">{state.errors.justificativa[0]}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton />
            <Button variant="outline" type="button" onClick={() => window.history.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
