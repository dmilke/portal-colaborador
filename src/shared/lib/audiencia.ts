import { createClient } from '@/lib/supabase/server'

export interface AudienciaItem {
  id: string
  entidadeTipo: string
  entidadeId: string
  tipo: 'departamento' | 'unidade' | 'cargo' | 'role' | 'colaborador'
  alvoId: string
  alvoNome: string | null
}

export interface AudienciaInput {
  tipo: 'departamento' | 'unidade' | 'cargo' | 'role' | 'colaborador'
  alvoId: string
}

export async function getAudiencias(entidadeTipo: string, entidadeId: string): Promise<AudienciaItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('audiencias')
    .select('id, entidade_tipo, entidade_id, tipo, alvo_id')
    .eq('entidade_tipo', entidadeTipo)
    .eq('entidade_id', entidadeId)
  return (data ?? []).map(mapRow)
}

export async function saveAudiencias(
  entidadeTipo: string,
  entidadeId: string,
  audiencias: AudienciaInput[]
): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('audiencias')
    .delete()
    .eq('entidade_tipo', entidadeTipo)
    .eq('entidade_id', entidadeId)
  if (audiencias.length === 0) return
  const { error } = await supabase.from('audiencias').insert(
    audiencias.map(a => ({
      entidade_tipo: entidadeTipo,
      entidade_id: entidadeId,
      tipo: a.tipo,
      alvo_id: a.alvoId,
    }))
  )
  if (error) throw error
}

export async function deleteAudiencias(entidadeTipo: string, entidadeId: string): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('audiencias')
    .delete()
    .eq('entidade_tipo', entidadeTipo)
    .eq('entidade_id', entidadeId)
}

function mapRow(r: Record<string, unknown>): AudienciaItem {
  return {
    id: r.id as string,
    entidadeTipo: r.entidade_tipo as string,
    entidadeId: r.entidade_id as string,
    tipo: r.tipo as AudienciaItem['tipo'],
    alvoId: r.alvo_id as string,
    alvoNome: null,
  }
}
