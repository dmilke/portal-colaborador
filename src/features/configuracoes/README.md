# Configuracoes do Sistema

Gestao de configuracoes globais do sistema.

**Rota:** `/configuracoes`

**Subdominio:** Governanca

## Funcionalidades

### Visualizacao e Edicao
- Lista todas as configuracoes predefinidas do banco de dados
- Agrupamento automatico por categoria (Geral, Sistema, Notificacoes, Portal)
- Edicao inline de cada configuracao
- Exibicao do valor original ao modificar
- Indicador visual de pendencias nas abas de categoria

### Categorias
| Categoria | Prefixos de Chave |
|-----------|-------------------|
| Geral | (padrao) |
| Sistema | `sistema_`, `fechamento_`, `antecedencia_`, `solicitacoes_simultaneas` |
| Notificacoes | `notificacao_`, `email_`, `whatsapp_` |
| Portal | `portal_`, `tema_`, `idioma_` |

### Validacao
- Tipo `integer`: valida que o valor e um numero inteiro
- Valor nao pode ser vazio

### Confirmacao
- Dialog de confirmacao antes de salvar
- Mostra a chave e o novo valor

## Configuracoes Iniciais (Seed)

| Chave | Valor | Tipo | Descricao |
|-------|-------|------|-----------|
| `fechamento_dia` | `25` | integer | Dia de fechamento mensal para solicitacoes (RN-012) |
| `antecedencia_meses` | `12` | integer | Antecedencia maxima em meses para solicitar folga (RN-013) |
| `solicitacoes_simultaneas_max` | `3` | integer | Quantidade maxima de solicitacoes simultaneas pendentes/ativas por colaborador |

## Seguranca

### RBAC
- `configuracao.editar`: Necessario para acessar e editar
- Apenas role `admin` possui esta permissao

### RLS
- SELECT: Todos os autenticados
- INSERT/UPDATE/DELETE: Apenas admin

### Auditoria
- Toda alteracao registrada com acao `alteracao_configuracoes`
- Descricao: `Configuracao "chave" alterada para "valor"`

## Arquitetura

```
configuracoes/
├── types/index.ts                          # Configuracao, UpdateConfiguracaoInput, categorias
├── repositories/configuracao-repository.ts # Queries por chave
├── services/configuracao-service.ts        # Validacao de tipo, agrupamento
├── schemas/configuracao-schema.ts          # Zod
├── actions/configuracao-actions.ts         # Server action com auditoria
├── components/configuracao-editor.tsx      # Editor com abas de categoria
└── index.ts                                # Barrel export
```

## Reused Components

- `AdminPageLayout` — Layout
- `AdminConfirmDialog` — Confirmacao
- `Card`, `Input`, `Label`, `Button` — UI
- `toast` (sonner) — Notificacoes
- `Save`, `Loader2` — Icons