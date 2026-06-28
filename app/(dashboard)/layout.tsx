'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Sidebar } from '@/src/shared/components/sidebar'
import { Header } from '@/src/shared/components/header'
import { MobileNav } from '@/src/shared/components/mobile-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-dvh">
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64',
        )}
      >
        <Header onMenuClick={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
