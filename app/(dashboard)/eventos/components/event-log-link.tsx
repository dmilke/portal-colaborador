import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScrollText } from 'lucide-react'

export function EventLogLink() {
  return (
    <Button variant="outline" size="sm">
      <Link href="/eventos/log" className="flex items-center">
        <ScrollText className="h-4 w-4 mr-1" />
        Log de Eventos
      </Link>
    </Button>
  )
}
