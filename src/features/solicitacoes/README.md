# Solicitacoes

Gestao de solicitacoes de folga e ausencia dos colaboradores.

**Rotas:**
- `/solicitacoes` — Listagem com filtros, paginacao, ordenacao
- `/solicitacoes/nova` — Criacao de nova solicitacao
- `/solicitacoes/[id]` — Detalhe e acoes (aprovar/reprovar/cancelar)

**Subdominio:** Pessoas

**Responsabilidades:**
- CRUD completo de solicitacoes
- Workflow de aprovacao (multi-step via workflow_definitions)
- Tipos de folga configuraveis (`tipo_folga`)
- Datas bloqueadas por departamento/unidade
- Turnos por departamento
- Integracao com Event Engine

**Estados da Solicitacao:**
`pendente` → `aprovada` | `reprovada` | `cancelada` | `expirada`

**Eventos Emitidos:**
- `solicitacao.created` — Nova solicitacao criada
- `solicitacao.approved` — Aprovada
- `solicitacao.rejected` — Reprovada
- `solicitacao.cancelled` — Cancelada

**Auditoria:**
Todas as operacoes registradas na tabela `auditoria`:
- `solicitacao` (criacao)
- `aprovacao` (aprovacao)
- `reprovacao` (reprovacao)
- `cancelamento` (cancelamento)

**RBAC:**
| Permissao | Acao |
|-----------|------|
| `solicitacoes.create` | Criar solicitacao (proprio) |
| `solicitacoes.read` | Visualizar (proprias ou admin) |
| `solicitacoes.update` | Aprovar/Reprovar (aprovadores) |
| `solicitacoes.delete` | Cancelar (proprio) |

**Arquitetura:**
```
solicitacoes/
├── types/index.ts              # Solicitacao, TipoFolga, Turno, Workflow, Audit
├── schemas/solicitacao-schema.ts
├── repositories/solicitacao-repository.ts
├── services/solicitacao-service.ts    # Logica + Event Engine
├── actions/solicitacao-actions.ts     # Server Actions
├── components/
│   ├── solicitacao-table.tsx
│   ├── solicitacao-form.tsx
│   └── solicitacao-detail.tsx
└── index.ts
```

**Qualidade:**
- 0 erros de lint
- 0 erros de TypeScript
- Build limpo