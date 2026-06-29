# Turnos

Gestao de turnos da organizacao.

**Rota:** `/turnos`

**Subdominio:** Gestao

## Funcionalidades

### Listagem
- Lista de turnos com busca, ordenacao e paginacao
- Abas: Ativos, Inativos, Todos
- Colunas: Nome, Departamento, Descricao, Status, Criado em

### Criacao
- Formulario com selecao de departamento (obrigatorio)
- Nome do turno (obrigatorio, unico por departamento)
- Descricao (opcional)

### Edicao
- Mesmo formulario da criacao com dados preenchidos
- Campos: Departamento, Nome, Descricao

### Exclusao
- Exclusao logica (soft delete)
- Dialog de confirmacao
- Possibilidade de restauracao

### Ativacao/Desativacao
- Toggle de status ativo/inativo
- Acao rapida via botao na tabela

### Restauracao
- Restaura turnos excluidos
- Disponivel na aba "Todos"

## Campos

| Campo | Tipo | Obrigatorio | Observacao |
|-------|------|-------------|------------|
| id | UUID | auto | Chave primaria |
| departamento_id | UUID | sim | FK para departamentos |
| nome | VARCHAR(100) | sim | Unico por departamento |
| descricao | TEXT | nao | |
| is_active | BOOLEAN | auto | Default true |
| created_at | TIMESTAMPTZ | auto | |
| updated_at | TIMESTAMPTZ | auto | |
| created_by | UUID | auto | |
| updated_by | UUID | auto | |
| deleted_at | TIMESTAMPTZ | auto | Soft delete |

## Seguranca

### RBAC
- `turnos.create`: Necessario para criar turnos
- `turnos.update`: Necessario para editar e ativar/desativar
- `turnos.delete`: Necessario para excluir e restaurar

### RLS
- SELECT: Todos os autenticados (apenas nao excluidos)
- INSERT/UPDATE/DELETE: Apenas admin

### Unicidade
- Constraint unica: `(departamento_id, nome)` WHERE deleted_at IS NULL
- Validacao no servico antes de criar/atualizar

## Auditoria

Todas as operacoes (criar, atualizar, excluir, restaurar, ativar, desativar) sao registradas na tabela `auditoria` via infraestrutura existente.

## Arquitetura

```
turnos/
├── types/index.ts                    # Turno, CreateTurnoInput, UpdateTurnoInput
├── repositories/turno-repository.ts  # Queries Supabase com join departamentos
├── services/turno-service.ts         # Logica de negocio
├── schemas/turno-schema.ts           # Validacao Zod
├── actions/turno-actions.ts          # Server actions
├── components/
│   ├── turno-form.tsx                # Formulario (select dept, nome, descricao)
│   └── turno-table.tsx               # Tabela com acoes
└── index.ts                          # Barrel export
```

## Reused Components

- `AdminPageLayout` — Layout de pagina admin
- `AdminToolbar` — Toolbar com abas e botao de acao
- `AdminStatusBadge` — Badge de status (Ativo/Inativo/Excluido)
- `AdminActionButtons` — Botoes de acao (editar, excluir, restaurar, ativar)
- `AdminConfirmDialog` — Dialog de confirmacao
- `DataTable` — Tabela com busca, sort, paginacao
- `Card`, `Input`, `Textarea`, `Label`, `Button`, `Alert` — UI components
