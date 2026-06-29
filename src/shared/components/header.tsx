'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  User,
  Settings,
  LogOut,
  Keyboard,
  HelpCircle,
} from 'lucide-react'
import { useTheme } from '@/src/shared/providers/theme-provider'
import { logoutAction } from '@/src/features/auth/actions/auth-actions'
import { Breadcrumbs } from './breadcrumbs'
import type { ColaboradorSession } from '@/src/features/auth/types'

interface HeaderProps {
  onMenuClick: () => void
  colaborador: ColaboradorSession | null
  unreadCount?: number
}

export function Header({ onMenuClick, colaborador, unreadCount = 0 }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const initials = colaborador
    ? colaborador.nome
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  const displayRole = colaborador?.roles[0] ?? 'Colaborador'

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="hidden md:flex items-center flex-1 min-w-0">
        <Breadcrumbs />
      </div>

      <div className="hidden md:flex items-center gap-2 max-w-sm ml-auto mr-2">
        <InputGroup className="w-full">
          <InputGroupAddon align="inline-start">
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Buscar..."
            className="h-9"
          />
        </InputGroup>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative"
          onClick={() => window.location.href = '/notificacoes'}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 h-8 rounded-md hover:bg-accent transition-colors cursor-pointer">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col items-start text-left">
              <span className="text-sm font-medium leading-none">
                {colaborador?.nome ?? 'Carregando...'}
              </span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5">
                {displayRole}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {colaborador?.nome ?? 'Usuário'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {colaborador?.email ?? ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Keyboard className="mr-2 h-4 w-4" />
                <span>Atalhos de teclado</span>
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Ajuda</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={logoutAction}>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => {
                    const form = e.currentTarget.closest('form')
                    if (form) {
                      const submitter = document.createElement('button')
                      submitter.type = 'submit'
                      submitter.style.display = 'none'
                      form.appendChild(submitter)
                      submitter.click()
                      form.removeChild(submitter)
                    }
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </header>
  )
}
