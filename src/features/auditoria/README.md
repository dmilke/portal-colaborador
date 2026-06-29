# Auditoria

Registro e consulta de trilha de auditoria.

**Rotas:**
- `/auditoria` — Listagem com filtros
- `/auditoria/[id]` — Detalhe do registro

**Subdominio:** Governanca

## Funcionalidades

### Listagem
- Tabela com busca, ordenacao e paginacao
- Colunas: Data/Hora, Colaborador, Acao, Entidade, Descricao, Link para detalhe
- Contador de registros encontrados

### Filtros
- **Data Inicio / Data Fim**: Range de datas
- **Colaborador**: Selecao do colaborador
- **Acao**: Tipo de acao (login, cadastro, alteracao, etc.)
- **Tipo de Entidade**: Tipo da entidade afetada
- **ID da Entidade**: UUID especifico
- Botoes: Filtrar e Limpar

### Detalhe
- Card com informacoes gerais: Data/Hora, Acao (badge colorido), Colaborador, Tipo de Entidade, ID, Descricao, IP, User Agent
- Card com valores: Valor Anterior e Valor Novo (formato JSON)

## Acoes Suportadas

| Acao | Cor | Descricao |
|------|-----|-----------|
| login | Azul | Autenticacao |
| cadastro | Verde | Criacao de registro |
| alteracao | Amarelo | Modificacao de registro |
| solicitacao | Roxo | Criacao de solicitacao |
| aprovacao | Esmeralda | Aprovacao de solicitacao |
| reprovacao | Vermelho | Reprovacao de solicitacao |
| cancelamento | Cinza | Cancelamento |
| alteracao_equipe | Laranja | Mudanca de equipe |
| alteracao_configuracoes | Ciano | Mudanca de configuracoes |

## Seguranca

### RBAC
- `auditoria.consultar`: Necessario para acessar o modulo
- Apenas role `admin` possui esta permissao

### RLS
- SELECT: Apenas admin
- INSERT: Autenticados (via triggers e service role)

### Imutabilidade
- Registros de auditoria nao podem ser alterados ou excluidos
- Inserts sao feitos via triggers e service role

## Arquitetura

```
auditoria/
├── types/index.ts                          # Auditoria, AuditoriaFiltros, AcaoTipo
├── repositories/auditoria-repository.ts    # Queries Supabase com joins e filtros
├── services/auditoria-service.ts           # Logica de negocio
└── components/
    ├── auditoria-filters.tsx               # Filtros de busca
    ├── auditoria-table.tsx                 # Tabela com ordenacao e paginacao
    └── auditoria-detail.tsx                # Visualizacao de detalhe
```

## Reused Components

- `AdminPageLayout` — Layout de pagina admin
- `DataTable` — Tabela com busca, sort, paginacao
- `Card`, `Input` — UI components
