'use client'

import { ConfiguracaoEditor } from '@/src/features/configuracoes/components/configuracao-editor'
import type { ConfiguracaoCategoria } from '@/src/features/configuracoes/types'

interface ConfiguracoesPageContentProps {
  categories: ConfiguracaoCategoria[]
}

export function ConfiguracoesPageContent({ categories }: ConfiguracoesPageContentProps) {
  return (
    <ConfiguracaoEditor categories={categories} />
  )
}
