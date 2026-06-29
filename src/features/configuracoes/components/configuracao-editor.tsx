'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog } from '@/src/shared/components/admin'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateConfiguracaoAction } from '../actions/configuracao-actions'
import type { ConfiguracaoCategoria } from '../types'

interface ConfiguracaoEditorProps {
  categories: ConfiguracaoCategoria[]
}

export function ConfiguracaoEditor({ categories }: ConfiguracaoEditorProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.key ?? '')
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingSave, setPendingSave] = useState<{ chave: string; valor: string } | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const activeGroup = categories.find((c) => c.key === activeCategory)

  function getDisplayValue(chave: string, original: string): string {
    return editValues[chave] ?? original
  }

  function handleEdit(chave: string, currentValor: string, newValue: string) {
    if (newValue === currentValor) {
      setEditValues((prev) => {
        const next = { ...prev }
        delete next[chave]
        return next
      })
    } else {
      setEditValues((prev) => ({ ...prev, [chave]: newValue }))
    }
  }

  function handleSaveClick(chave: string, valor: string) {
    setPendingSave({ chave, valor })
    setConfirmOpen(true)
  }

  async function handleConfirmSave() {
    if (!pendingSave) return
    setConfirmOpen(false)
    setSaving(pendingSave.chave)

    const formData = new FormData()
    formData.append('chave', pendingSave.chave)
    formData.append('valor', pendingSave.valor)

    const result = await updateConfiguracaoAction(null, formData)
    setSaving(null)

    if (result?.success) {
      toast.success('Configuracao atualizada')
      setEditValues((prev) => {
        const next = { ...prev }
        delete next[pendingSave.chave]
        return next
      })
    } else {
      toast.error(result?.message ?? 'Erro ao atualizar configuracao')
    }

    setPendingSave(null)
  }

  function getInputType(tipo: string): 'text' | 'number' {
    return tipo === 'integer' ? 'number' : 'text'
  }

  function isModified(chave: string): boolean {
    return chave in editValues
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.key}
            variant={activeCategory === cat.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
            {cat.settings.some((s) => isModified(s.chave)) && (
              <span className="ml-1.5 h-2 w-2 rounded-full bg-yellow-400 inline-block" />
            )}
          </Button>
        ))}
      </div>

      {activeGroup && (
        <div className="space-y-4">
          {activeGroup.settings.map((setting) => (
            <Card key={setting.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{setting.chave.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</CardTitle>
                {setting.descricao && (
                  <CardDescription>{setting.descricao}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor={setting.chave}>
                      Valor ({setting.tipo})
                    </Label>
                    <Input
                      id={setting.chave}
                      type={getInputType(setting.tipo)}
                      value={getDisplayValue(setting.chave, setting.valor)}
                      onChange={(e) => handleEdit(setting.chave, setting.valor, e.target.value)}
                      disabled={saving === setting.chave}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={!isModified(setting.chave) || saving === setting.chave}
                      onClick={() => handleSaveClick(setting.chave, editValues[setting.chave] ?? setting.valor)}
                    >
                      {saving === setting.chave ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-1" />
                      )}
                      Salvar
                    </Button>
                  </div>
                </div>

                {isModified(setting.chave) && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Valor original: {setting.valor}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AdminConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmOpen(false)
            setPendingSave(null)
          }
        }}
        title="Salvar configuracao"
        description={`Deseja realmente alterar "${pendingSave?.chave ?? ''}" para "${pendingSave?.valor ?? ''}"? Esta acao sera registrada na auditoria.`}
        confirmLabel="Confirmar"
        confirmVariant="default"
        onConfirm={handleConfirmSave}
      />
    </div>
  )
}
