'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, User } from 'lucide-react'
import type { DocumentoVersao } from '../types'

interface Props {
  versions: DocumentoVersao[]
  currentVersion: number
  onSelectVersion: (version: DocumentoVersao) => void
}

export function DocumentoVersionTimeline({ versions, onSelectVersion }: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Histórico de Versões ({versions.length})
      </h3>
      <ScrollArea className="max-h-80">
        <div className="space-y-2">
          {versions.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelectVersion(v)}
              className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                v.isCurrent ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">v{v.versao}</span>
                  {v.isCurrent && (
                    <Badge variant="default" className="text-xs">Atual</Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(v.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>
              {v.titulo && (
                <p className="mt-1 text-sm font-medium">{v.titulo}</p>
              )}
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                {v.autorNome && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {v.autorNome}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(v.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
