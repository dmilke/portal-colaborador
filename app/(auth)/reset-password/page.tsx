'use client'

import { Label } from '@/components/ui/label'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Nova senha</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha uma nova senha para sua conta
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">Nova senha</Label>
          <InputGroup className="w-full">
            <InputGroupAddon align="inline-start">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="new-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar senha</Label>
          <InputGroup className="w-full">
            <InputGroupAddon align="inline-start">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </InputGroup>
        </div>

        <Button type="submit" className="w-full">
          Redefinir senha
        </Button>
      </div>
    </div>
  )
}
