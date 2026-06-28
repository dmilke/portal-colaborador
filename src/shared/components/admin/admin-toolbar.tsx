'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Tab {
  value: string
  label: string
}

interface AdminToolbarProps {
  tabs?: Tab[]
  currentTab?: string
  onTabChange?: (value: string) => void
  actionButton?: {
    label: string
    onClick: () => void
  } | null
}

export function AdminToolbar({ tabs, currentTab, onTabChange, actionButton }: AdminToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      {tabs && currentTab && onTabChange && (
        <Tabs value={currentTab} onValueChange={onTabChange}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      {actionButton && (
        <Button onClick={actionButton.onClick} className={!tabs ? 'ml-auto' : undefined}>
          <Plus className="h-4 w-4 mr-2" />
          {actionButton.label}
        </Button>
      )}
    </div>
  )
}
