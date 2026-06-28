'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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
  ChevronLeft,
  FileSpreadsheet,
  Megaphone,
  UserCircle,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const navigation = [
  {
    group: 'Principal',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Gestão',
    items: [
      { title: 'Colaboradores', href: '/dashboard/colaboradores', icon: Users },
      { title: 'Departamentos', href: '/dashboard/departamentos', icon: Building2 },
      { title: 'Cargos', href: '/dashboard/cargos', icon: Briefcase },
      { title: 'Unidades', href: '/dashboard/unidades', icon: Building2 },
    ],
  },
  {
    group: 'Solicitações',
    items: [
      { title: 'Solicitações', href: '/dashboard/solicitacoes', icon: ClipboardList },
      { title: 'Folgas', href: '/dashboard/folgas', icon: Clock },
    ],
  },
  {
    group: 'Comunicação',
    items: [
      { title: 'Notificações', href: '/dashboard/notificacoes', icon: Bell },
      { title: 'Comunicados', href: '/dashboard/comunicados', icon: Megaphone },
    ],
  },
  {
    group: 'Documentos',
    items: [
      { title: 'Documentos', href: '/dashboard/documentos', icon: FileText },
    ],
  },
  {
    group: 'Sistema',
    items: [
      { title: 'Auditoria', href: '/dashboard/auditoria', icon: FileSpreadsheet },
      { title: 'Administração', href: '/dashboard/administracao', icon: Shield },
      { title: 'Perfil', href: '/dashboard/perfil', icon: UserCircle },
    ],
  },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              PC
            </div>
            <span className="text-sm">Portal</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              PC
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            'h-7 w-7 shrink-0',
            collapsed && 'mx-auto absolute -right-3 top-3.5 z-40 h-6 w-6 rounded-full border bg-background shadow-sm',
          )}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-4">
          {navigation.map((group) => (
            <div key={group.group}>
              {!collapsed && (
                <p className="px-2 text-xs font-medium text-sidebar-foreground/50 mb-1 tracking-wider uppercase">
                  {group.group}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                          collapsed && 'justify-center px-0',
                        )}
                        title={collapsed ? item.title : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      <div className={cn('p-3', collapsed && 'flex justify-center')}>
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs text-muted-foreground">admin@email.com</span>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            AD
          </div>
        )}
      </div>
    </aside>
  )
}
