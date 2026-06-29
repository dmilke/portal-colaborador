import { z } from 'zod'

export const configuracaoUpdateSchema = z.object({
  chave: z.string().min(1, 'Chave obrigatoria'),
  valor: z.string().min(1, 'Valor obrigatorio'),
})

export type ConfiguracaoUpdateFormData = z.infer<typeof configuracaoUpdateSchema>
