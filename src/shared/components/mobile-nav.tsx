'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Clock,
  FileText,
  Bell,
  ClipboardList,
  Shield,
  FileSpreadsheet,
  Megaphone,
  UserCircle,
  X,
} from 'lucide-react'

const navigation = [
  {
    group: 'Principal',
    items: [
      { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Gestão',
    items: [
      { title: 'Colaboradores', href: '/colaboradores', icon: Users },
      { title: 'Departamentos', href: '/departamentos', icon: Building2 },
      { title: 'Cargos', href: '/cargos', icon: Briefcase },
      { title: 'Unidades', href: '/unidades', icon: Building2 },
    ],
  },
  {
    group: 'Solicitações',
    items: [
      { title: 'Solicitações', href: '/solicitacoes', icon: ClipboardList },
      { title: 'Folgas', href: '/folgas', icon: Clock },
    ],
  },
  {
    group: 'Comunicação',
    items: [
      { title: 'Notificações', href: '/notificacoes', icon: Bell },
      { title: 'Comunicados', href: '/comunicados', icon: Megaphone },
    ],
  },
  {
    group: 'Documentos',
    items: [
      { title: 'Documentos', href: '/documentos', icon: FileText },
    ],
  },
  {
    group: 'Sistema',
    items: [
      { title: 'Auditoria', href: '/auditoria', icon: FileSpreadsheet },
      { title: 'Administração', href: '/administracao', icon: Shield },
      { title: 'Perfil', href: '/perfil', icon: UserCircle },
    ],
  },
]

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
        <SheetHeader className="flex h-14 flex-row items-center justify-between px-4 border-b gap-0">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              PC
            </div>
            <span className="text-sm">Portal</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <ScrollArea className="flex-1 px-3 py-3" style={{ height: 'calc(100dvh - 3.5rem)' }}>
          <nav className="space-y-4">
            {navigation.map((group) => (
              <div key={group.group}>
                <p className="px-2 text-xs font-medium text-muted-foreground mb-1 tracking-wider uppercase">
                  {group.group}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => onOpenChange(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-accent text-accent-foreground'
                              : 'text-foreground/70 hover:text-foreground hover:bg-accent/50',
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
