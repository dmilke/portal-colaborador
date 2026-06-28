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

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()

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

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm">
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

      <div className="flex items-center gap-1 ml-auto">
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
        >
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-medium">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start text-left">
                <span className="text-sm font-medium leading-none">Admin</span>
                <span className="text-xs text-muted-foreground leading-none mt-0.5">Administrador</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@email.com</p>
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
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </header>
  )
}
