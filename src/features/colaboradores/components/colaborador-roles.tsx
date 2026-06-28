'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Shield } from 'lucide-react'
import { updateRolesAction } from '../actions/colaborador-actions'

interface ColaboradorRolesProps {
  colaboradorId: string
  currentRoles: string[]
  allRoles: { id: string; nome: string; descricao: string | null }[]
  canAssign: boolean
}

export function ColaboradorRoles({ colaboradorId, currentRoles, allRoles, canAssign }: ColaboradorRolesProps) {
  const router = useRouter()
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    allRoles.filter((r) => currentRoles.includes(r.nome)).map((r) => r.id),
  )
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    const result = await updateRolesAction(colaboradorId, selectedRoles)
    setLoading(false)
    if (result.success) {
      toast.success('Funções atualizadas')
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao atualizar funções')
    }
  }

  function toggleRole(roleId: string) {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-lg">Funções</CardTitle>
            <CardDescription>Gerencie as funções e permissões do colaborador</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-sm text-muted-foreground">Atuais:</span>
          {currentRoles.length > 0
            ? currentRoles.map((role) => (
                <Badge key={role} variant="secondary">{role}</Badge>
              ))
            : <span className="text-sm text-muted-foreground">Nenhuma</span>}
        </div>

        {canAssign && (
          <>
            <div className="space-y-2">
              {allRoles.map((role) => (
                <div key={role.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    className="rounded"
                  />
                  <Label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer">
                    <span className="font-medium">{role.nome}</span>
                    {role.descricao && (
                      <span className="text-sm text-muted-foreground ml-2">— {role.descricao}</span>
                    )}
                  </Label>
                </div>
              ))}
            </div>

            <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar funções
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
