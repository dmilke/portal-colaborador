export interface Configuracao {
  id: string
  chave: string
  valor: string
  tipo: string
  descricao: string | null
  categoria: string
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
}

export interface UpdateConfiguracaoInput {
  valor: string
}

export type ConfiguracaoCategoria = {
  key: string
  label: string
  settings: Configuracao[]
}

export function deriveCategory(chave: string): string {
  if (chave.startsWith('notificacao') || chave.startsWith('email') || chave.startsWith('whatsapp')) return 'notificacoes'
  if (chave.startsWith('portal') || chave.startsWith('tema') || chave.startsWith('idioma')) return 'portal'
  if (chave.startsWith('sistema') || chave.startsWith('fechamento') || chave.startsWith('antecedencia') || chave.startsWith('solicitacoes_simultaneas')) return 'sistema'
  return 'geral'
}

export const categoriaLabels: Record<string, string> = {
  geral: 'Geral',
  sistema: 'Sistema',
  notificacoes: 'Notificacoes',
  portal: 'Portal',
}
