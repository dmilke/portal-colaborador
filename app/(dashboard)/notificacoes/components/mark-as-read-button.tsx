'use client'

import { useTransition } from 'react'
import { markNotificacaoAsReadAction } from '@/src/features/notificacoes/actions/notificacao-actions'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export function MarkAsReadButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      await markNotificacaoAsReadAction(id)
      window.location.reload()
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 shrink-0"
      onClick={handleClick}
      disabled={isPending}
      title="Marcar como lida"
    >
      <Check className="h-4 w-4" />
    </Button>
  )
}
