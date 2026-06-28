'use client'

import { Label } from '@/components/ui/label'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Recuperar senha</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enviaremos um link de recuperação para seu email
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <InputGroup className="w-full">
            <InputGroupAddon align="inline-start">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </InputGroup>
        </div>

        <Button type="submit" className="w-full">
          Enviar link de recuperação
        </Button>
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}
