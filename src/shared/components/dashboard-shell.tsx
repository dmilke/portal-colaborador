'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { MobileNav } from './mobile-nav'
import type { ColaboradorSession } from '@/src/features/auth/types'

interface DashboardShellProps {
  children: React.ReactNode
  colaborador: ColaboradorSession | null
}

export function DashboardShell({ children, colaborador }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-dvh">
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        colaborador={colaborador}
      />

      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64',
        )}
      >
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          colaborador={colaborador}
        />

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
