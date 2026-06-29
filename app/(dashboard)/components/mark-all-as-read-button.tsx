'use client'

import { useTransition } from 'react'
import { markAllNotificacoesAsReadAction } from '@/src/features/notificacoes/actions/notificacao-actions'
import { Button } from '@/components/ui/button'
import { CheckCheck } from 'lucide-react'

export function MarkAllAsReadButton() {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      await markAllNotificacoesAsReadAction()
      window.location.reload()
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 text-xs"
      onClick={handleClick}
      disabled={isPending}
    >
      <CheckCheck className="h-3 w-3 mr-1" />
      {isPending ? 'Marcando...' : 'Marcar todas'}
    </Button>
  )
}
