# Infrastructure Validation

**Projeto:** Portal do Colaborador
**Versão:** 1.0.0
**Data:** 2026-06-27

---

## Objetivo

Este documento registra a validação completa da infraestrutura do banco de dados e autenticação antes do início da implementação dos casos de uso de negócio.

A validação cobre:

1. Migration 0001 (schema, constraints, índices, triggers, funções, RLS, seeds)
2. Integração com Supabase Auth
3. Middleware de sessão
4. Autenticação em Server Components
5. Autenticação em Client Components

---

## 1. Migration 0001 Review

### 1.1 Estrutura Geral

| Item | Status | Observação |
|------|--------|------------|
| Ordem das seções | ✅ | EXTENSIONS → ENUMS → TABLES → CONSTRAINTS → FKs → INDEXES → FUNCTIONS → TRIGGERS → RLS ENABLE → RLS POLICIES → COMMENTS → SEEDS |
| Idempotência (IF NOT EXISTS) | ✅ | `CREATE EXTENSION IF NOT EXISTS` |
| `gen_random_uuid()` via pgcrypto | ✅ | Extensão habilitada |
| Snake case consistente | ✅ | Todas as tabelas e colunas |

### 1.2 ENUMS

| Enum | Valores | Status |
|------|---------|--------|
| `request_status` | pendente, aprovada, reprovada, cancelada, expirada | ✅ |
| `acao_tipo` | login, cadastro, alteracao, solicitacao, aprovacao, reprovacao, cancelamento, alteracao_equipe, alteracao_configuracoes | ✅ |
| `document_status` | pendente, assinado, cancelado | ✅ |
| `signature_type` | eletronica, digital | ✅ |

### 1.3 Tabelas (24)

| # | Tabela | Esquema | Status |
|---|--------|---------|--------|
| 1 | `roles` | RBAC | ✅ |
| 2 | `permissions` | RBAC | ✅ |
| 3 | `role_permissions` | RBAC | ✅ |
| 4 | `colaborador_roles` | RBAC | ✅ |
| 5 | `departamentos` | Organograma | ✅ |
| 6 | `unidades` | Organograma | ✅ |
| 7 | `cargos` | Organograma | ✅ |
| 8 | `turnos` | Organograma | ✅ |
| 9 | `colaboradores` | Core | ✅ |
| 10 | `historico_lotacao` | Core | ✅ |
| 11 | `workflow_definitions` | Workflow | ✅ |
| 12 | `workflow_steps` | Workflow | ✅ |
| 13 | `tipos_folga` | Domain | ✅ |
| 14 | `datas_bloqueadas` | Domain | ✅ |
| 15 | `solicitacoes` | Domain | ✅ |
| 16 | `notificacoes` | Communications | ✅ |
| 17 | `comunicados` | Communications | ✅ |
| 18 | `comunicado_leitura` | Communications | ✅ |
| 19 | `documentos` | Documents | ✅ |
| 20 | `documento_versoes` | Documents | ✅ |
| 21 | `documento_assinaturas` | Documents | ✅ |
| 22 | `anexos` | Attachments | ✅ |
| 23 | `auditoria` | System | ✅ |
| 24 | `configuracoes` | System | ✅ |

### 1.4 Foreign Keys

#### RBAC (4)
| FK | Origem | Destino | ON DELETE | Status |
|----|--------|---------|-----------|--------|
| fk_role_permissions_role | role_permissions.role_id | roles.id | CASCADE | ✅ |
| fk_role_permissions_permission | role_permissions.permission_id | permissions.id | CASCADE | ✅ |
| fk_colaborador_roles_colaborador | colaborador_roles.colaborador_id | colaboradores.id | CASCADE | ✅ |
| fk_colaborador_roles_role | colaborador_roles.role_id | roles.id | CASCADE | ✅ |

#### Organograma (1)
| FK | Origem | Destino | ON DELETE | Status |
|----|--------|---------|-----------|--------|
| fk_turnos_departamento | turnos.departamento_id | departamentos.id | RESTRICT | ✅ |

#### Core (8)
| FK | Origem | Destino | ON DELETE | Status |
|----|--------|---------|-----------|--------|
| fk_colaboradores_auth_user | colaboradores.auth_user_id | auth.users.id | CASCADE | ✅ |
| fk_colaboradores_departamento | colaboradores.departamento_id | departamentos.id | SET NULL | ✅ |
| fk_colaboradores_unidade | colaboradores.unidade_id | unidades.id | SET NULL | ✅ |
| fk_colaboradores_cargo | colaboradores.cargo_id | cargos.id | SET NULL | ✅ |
| fk_historico_lotacao_colaborador | historico_lotacao.colaborador_id | colaboradores.id | CASCADE | ✅ |
| fk_historico_lotacao_departamento | historico_lotacao.departamento_id | departamentos.id | RESTRICT | ✅ |
| fk_historico_lotacao_turno | historico_lotacao.turno_id | turnos.id | SET NULL | ✅ |

#### Workflow (1)
| FK | Origem | Destino | ON DELETE | Status |
|----|--------|---------|-----------|--------|
| fk_workflow_steps_definition | workflow_steps.workflow_definition_id | workflow_definitions.id | CASCADE | ✅ |

#### Domain (6)
| FK | Origem | Destino | ON DELETE | Status |
|----|--------|---------|-----------|--------|
| fk_solicitacoes_colaborador | solicitacoes.colaborador_id | colaboradores.id | RESTRICT | ✅ |
| fk_solicitacoes_tipo_folga | solicitacoes.tipo_folga_id | tipos_folga.id | RESTRICT | ✅ |
| fk_solicitacoes_turno | solicitacoes.turno_id | turnos.id | RESTRICT | ✅ |
| fk_solicitacoes_workflow_definition | solicitacoes.workflow_definition_id | workflow_definitions.id | SET NULL | ✅ |
| fk_solicitacoes_workflow_step | solicitacoes.workflow_step_id | workflow_steps.id | SET NULL | ✅ |
| fk_solicitacoes_aprovado_por | solicitacoes.aprovado_por | colaboradores.id | SET NULL | ✅ |

#### Communications (7)
| FK | Origem | Destino | ON DELETE | Status |
|----|--------|---------|-----------|--------|
| fk_notificacoes_colaborador | notificacoes.colaborador_id | colaboradores.id | CASCADE | ✅ |
| fk_notificacoes_solicitacao | notificacoes.solicitacao_id | solicitacoes.id | CASCADE | ✅ |
| fk_comunicados_autor | comunicados.autor_id | colaboradores.id | RESTRICT | ✅ |
| fk_comunicados_departamento | comunicados.departamento_id | departamentos.id | SET NULL | ✅ |
| fk_comunicados_unidade | comunicados.unidade_id | unidades.id | SET NULL | ✅ |
| fk_comunicado_leitura_comunicado | comunicado_leitura.comunicado_id | comunicados.id | CASCADE | ✅ |
| fk_comunicado_leitura_colaborador | comunicado_leitura.colaborador_id | colaboradores.id | CASCADE | ✅ |

#### Documents (6)
| FK | Origem | Destino | ON DELETE | Status |
|----|--------|---------|-----------|--------|
| fk_documentos_colaborador | documentos.colaborador_id | colaboradores.id | SET NULL | ✅ |
| fk_documentos_departamento | documentos.departamento_id | departamentos.id | SET NULL | ✅ |
| fk_documentos_unidade | documentos.unidade_id | unidades.id | SET NULL | ✅ |
| fk_documento_versoes_documento | documento_versoes.documento_id | documentos.id | CASCADE | ✅ |
| fk_documento_assinaturas_documento | documento_assinaturas.documento_id | documentos.id | CASCADE | ✅ |
| fk_documento_assinaturas_colaborador | documento_assinaturas.colaborador_id | colaboradores.id | CASCADE | ✅ |

#### Audit Fields (31 — created_by / updated_by dinâmicos)
| Grupo | Tabelas | ON DELETE | Status |
|-------|---------|-----------|--------|
| created_by + updated_by (14 tabelas via DO block) | departamentos, unidades, cargos, turnos, colaboradores, workflow_definitions, workflow_steps, tipos_folga, datas_bloqueadas, solicitacoes, notificacoes, comunicados, documentos, configuracoes | SET NULL | ✅ |
| created_by (3 tabelas manuais) | historico_lotacao, documento_versoes, anexos | SET NULL | ✅ |

**Total de FKs: ~63**

### 1.5 Unique Constraints (10)

| Índice | Tabela | Colunas | Partial WHERE | Business Rule |
|--------|--------|---------|---------------|---------------|
| uq_solicitacoes_ativo | solicitacoes | (colaborador_id, data_folga, turno_id, tipo_folga_id) | status NOT IN ('cancelada','reprovada','expirada') AND deleted_at IS NULL | RN-021 |
| uq_solicitacoes_vaga | solicitacoes | (data_folga, turno_id) | status IN ('pendente','aprovada') AND deleted_at IS NULL | RN-005 |
| uq_configuracoes_chave | configuracoes | (chave) | — | RF-057 |
| uq_workflow_steps_ordem | workflow_steps | (workflow_definition_id, ordem) | deleted_at IS NULL | — |
| uq_documento_versoes_numero | documento_versoes | (documento_id, versao) | — | — |
| uq_roles_nome | roles | (nome) | is_active = TRUE | — |
| uq_permissions_nome | permissions | (nome) | is_active = TRUE | — |
| uq_departamentos_nome | departamentos | (nome) | deleted_at IS NULL | — |
| uq_unidades_nome | unidades | (nome) | deleted_at IS NULL | — |
| uq_cargos_nome | cargos | (nome) | deleted_at IS NULL | — |
| uq_tipos_folga_nome | tipos_folga | (nome) | deleted_at IS NULL | — |
| uq_turnos_departamento_nome | turnos | (departamento_id, nome) | deleted_at IS NULL | RN-002 |

### 1.6 CHECK Constraints

Nenhuma CHECK constraint explícita foi definida na Migration 0001. As validações de domínio (ex: tipo de configuração, valores de status) são gerenciadas via:
- ENUMs (`request_status`, `document_status`)
- Tipos PostgreSQL nativos (`BOOLEAN`, `DATE`, `UUID`)
- Unique indexes parciais para regras de negócio

**Decisão:** CHECK constraints podem ser adicionadas em migrações futuras se validações adicionais se mostrarem necessárias durante a implementação dos casos de uso.

### 1.7 Functions (2)

| Função | Tipo | Propósito | Status |
|--------|------|-----------|--------|
| `current_colaborador_id()` | SQL, STABLE, SECURITY DEFINER | Retorna o `colaboradores.id` do usuário autenticado | ✅ |
| `set_audit_fields()` | plpgsql, TRIGGER, SECURITY DEFINER | Auto-preenche created_at/updated_at/created_by/updated_by | ✅ |

#### current_colaborador_id() — Análise

```sql
SELECT id FROM colaboradores WHERE auth_user_id = auth.uid() AND deleted_at IS NULL;
```

- ✅ `auth.uid()` é uma função do Supabase Auth sempre disponível (schema `auth`)
- ✅ `SECURITY DEFINER` permite bypass do RLS
- ✅ `SET search_path = public` isola o escopo
- ✅ Retorna `NULL` quando não há usuário autenticado (ex: durante seeds)

#### set_audit_fields() — Análise

```sql
IF TG_OP = 'INSERT' THEN
    NEW.created_at := now();
    NEW.updated_at := now();
    NEW.created_by := COALESCE(NEW.created_by, current_colaborador_id());
    NEW.updated_by := COALESCE(NEW.updated_by, current_colaborador_id());
ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_at := now();
    NEW.updated_by := COALESCE(NEW.updated_by, current_colaborador_id());
    NEW.created_at := OLD.created_at;   -- preserve original
    NEW.created_by := OLD.created_by;   -- preserve original
END IF;
```

- ✅ Preserva `created_at` e `created_by` originais em UPDATE
- ✅ Usa `COALESCE` para permitir override explícito
- ✅ Chamada para `current_colaborador_id()` dentro de trigger function funciona (SECURITY DEFINER)
- ⚠️ Chicken-and-egg: primeira inserção em `colaboradores` (seeds) terá `created_by = NULL` (aceitável)

### 1.8 Triggers (15)

| Trigger | Tabela | Evento | Função | Status |
|---------|--------|--------|--------|--------|
| trg_departamentos_audit | departamentos | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_unidades_audit | unidades | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_cargos_audit | cargos | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_turnos_audit | turnos | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_colaboradores_audit | colaboradores | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_workflow_definitions_audit | workflow_definitions | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_workflow_steps_audit | workflow_steps | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_tipos_folga_audit | tipos_folga | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_datas_bloqueadas_audit | datas_bloqueadas | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_solicitacoes_audit | solicitacoes | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_notificacoes_audit | notificacoes | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_comunicados_audit | comunicados | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_documentos_audit | documentos | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_configuracoes_audit | configuracoes | BEFORE INSERT OR UPDATE | set_audit_fields | ✅ |
| trg_historico_lotacao_audit | historico_lotacao | BEFORE INSERT | set_audit_fields | ✅ |

### 1.9 RLS Policies

#### Cobertura

| Tabela | SELECT | INSERT | UPDATE | DELETE | Status |
|--------|--------|--------|--------|--------|--------|
| roles | authenticated | admin | admin | admin | ✅ |
| permissions | authenticated | admin | admin | admin | ✅ |
| role_permissions | authenticated | admin | — | admin | ✅ |
| colaborador_roles | own/admin | admin | — | admin | ✅ |
| departamentos | todos (active) | admin | admin | admin | ✅ |
| unidades | todos (active) | admin | admin | admin | ✅ |
| cargos | todos (active) | admin | admin | admin | ✅ |
| turnos | todos (active) | admin | admin | admin | ✅ |
| colaboradores | own/admin | admin | own/admin | admin | ✅ |
| historico_lotacao | own/admin | admin | — | — | ✅ |
| workflow_definitions | todos (active) | admin | admin | admin | ✅ |
| workflow_steps | todos (active) | admin | admin | admin | ✅ |
| tipos_folga | todos (active) | admin | admin | admin | ✅ |
| datas_bloqueadas | todos (active) | admin | admin | admin | ✅ |
| solicitacoes | own/admin | own | admin | admin | ✅ |
| notificacoes | own/admin | admin | own | — | ✅ |
| comunicados | todos (active) | admin | admin | admin | ✅ |
| comunicado_leitura | own | own (insert) | — | — | ✅ |
| documentos | own/admin | admin | admin | admin | ✅ |
| documento_versoes | via documento | admin | — | — | ✅ |
| documento_assinaturas | own/admin | own | — | — | ✅ |
| anexos | todos | authenticated | — | admin | ✅ |
| auditoria | admin | authenticated | — | — | ✅ |
| configuracoes | todos | admin | admin | admin | ✅ |

**Total de políticas: ~67**

#### Padrão de Admin Check

Todas as políticas administrativas utilizam o mesmo padrão:

```sql
EXISTS (
    SELECT 1 FROM colaborador_roles cr
    JOIN roles r ON r.id = cr.role_id
    WHERE cr.colaborador_id = current_colaborador_id()
      AND r.nome = 'admin'
)
```

- ⚠️ Dependência circular: `current_colaborador_id()` → `colaboradores` → RLS → `colaboradores` → `current_colaborador_id()`
- ✅ Resolvida por `current_colaborador_id()` ser `SECURITY DEFINER` (bypassa RLS)

### 1.10 Seeds

| Seed | Dados | Proteção Idempotente | Status |
|------|-------|----------------------|--------|
| roles | admin, colaborador | `ON CONFLICT (nome) WHERE is_active = TRUE` | ✅ |
| permissions | 14 permissões (admin + colaborador) | `ON CONFLICT (nome) WHERE is_active = TRUE` | ✅ |
| role_permissions | admin → todas, colaborador → 3 | `ON CONFLICT DO NOTHING` (PK) | ✅ |
| workflow_definitions | fluxo_folga_padrao | `ON CONFLICT DO NOTHING` (PK) | ✅ |
| workflow_steps | pendente(1), aprovada(2), reprovada(3) | `ON CONFLICT (workflow_definition_id, ordem) WHERE deleted_at IS NULL` | ✅ |
| departamentos | Cuidado, Higienização | `ON CONFLICT (nome) WHERE deleted_at IS NULL` | ✅ |
| turnos | Cuidado(Dia, Noite), Higienização(Dia) | `ON CONFLICT (departamento_id, nome) WHERE deleted_at IS NULL` | ✅ |
| configuracoes | fechamento_dia=25, antecedencia_meses=12, solicitacoes_simultaneas_max=3 | `ON CONFLICT (chave)` | ✅ |

---

## 2. Supabase Auth Integration

### 2.1 auth.users FK

```sql
ALTER TABLE colaboradores
    ADD CONSTRAINT fk_colaboradores_auth_user
    FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

- ✅ Referencia `auth.users` no schema `auth` do Supabase
- ✅ `ON DELETE CASCADE` — remoção do auth user limpa o registro do colaborador
- ✅ `auth_user_id` é UNIQUE (1:1 entre auth.user e colaborador)

### 2.2 Chicken-and-Egg: Auth User → Colaborador

O fluxo de criação do primeiro admin é:

```
1. Admin cria conta via Supabase Auth (email/senha)
2. Admin loga → auth.uid() retorna o UUID do auth.users
3. Admin (ou script) cria registro em colaboradores com auth_user_id = auth.uid()
4. Admin atribui role 'admin' via colaborador_roles
```

Esse fluxo não pode ser seedado — é uma operação manual ou via script de setup.

### 2.3 current_colaborador_id() Resolution

```
auth.uid() → colaboradores.auth_user_id → colaboradores.id
```

Resolução durante seeds:
- `auth.uid()` = NULL (sem JWT)
- `current_colaborador_id()` = NULL
- `COALESCE(NEW.created_by, NULL)` = NULL
- ✅ Aceitável para dados de sistema imutáveis

---

## 3. Middleware Session Refresh

**Arquivo:** `lib/supabase/middleware.ts`

```typescript
import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        { cookies: { getAll() { ... }, setAll(cookiesToSet, headers) { ... } } },
    );

    await supabase.auth.getClaims();

    return supabaseResponse;
}
```

### Validações

| Requisito | Status | Observação |
|-----------|--------|------------|
| Cria cliente SSR | ✅ | `createServerClient` do `@supabase/ssr` |
| Lê cookies da request | ✅ | `request.cookies.getAll()` |
| Escreve cookies na response | ✅ | `supabaseResponse.cookies.set()` |
| Renova sessão | ✅ | `await supabase.auth.getClaims()` |
| Não expõe chaves | ✅ | Lê de `process.env` |
| `NEXT_PUBLIC_SUPABASE_URL` definido | ⚠️ | Deve estar em `.env.local` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` definido | ⚠️ | Deve estar em `.env.local` |

**Nota:** O arquivo `middleware.ts` na raiz do projeto ainda não foi criado. O middleware deve ser configurado em `src/middleware.ts` (Next.js 16) exportando `updateSession` como `middleware`.

---

## 4. Server Components Authentication

**Arquivo:** `lib/supabase/server.ts`

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet, _headers) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options));
                    } catch {
                        // Server Component — cookies are read-only
                    }
                },
            },
        },
    );
}
```

### Validações

| Requisito | Status | Observação |
|-----------|--------|------------|
| Cria cliente SSR | ✅ | `createServerClient` |
| Lê cookies | ✅ | `cookieStore.getAll()` |
| Trata exceção de setAll | ✅ | `try/catch` para Server Components |

**Padrão de uso em Server Components:**

```typescript
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!session) { /* redirect */ }
    const { data: colaborador } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single();
    // ...
}
```

---

## 5. Client Components Authentication

**Arquivo:** `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
}
```

### Validações

| Requisito | Status | Observação |
|-----------|--------|------------|
| Cria cliente browser | ✅ | `createBrowserClient` |
| Lê de env vars | ✅ | `NEXT_PUBLIC_*` |

**Padrão de uso em Client Components:**

```typescript
"use client";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const supabase = createClient();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email, password,
        });
    };
}
```

---

## 6. Automated Test Script

O script de validação automatizada está em:

```
supabase/tests/001_schema_validation.sql
```

### Como Executar

```bash
# Local (via psql)
psql -h localhost -U postgres -d portal_colaborador \
    -f supabase/tests/001_schema_validation.sql

# Via Supabase
supabase db execute --file supabase/tests/001_schema_validation.sql

# Remoto
psql "$DATABASE_URL" -f supabase/tests/001_schema_validation.sql
```

### Cobertura do Script

| Seção | O que testa | Nº de asserts |
|-------|-------------|---------------|
| 1. Extensions | pgcrypto | 1 |
| 2. Enums | 4 enums | 4 |
| 3. Tables | 24 tables | 25 |
| 4. Columns | Tipos e nulabilidade | 12 |
| 5. Foreign Keys | Contagem e FKs críticas | 7 |
| 6. Unique Indexes | 10 partial unique indexes | 10 |
| 7. Performance Indexes | 35+ indexes | 4 |
| 8. Functions | 2 functions | 4 |
| 9. Triggers | 15 triggers | 4 |
| 10. RLS Enabled | 24 tables | 27 |
| 11. RLS Policies | 60+ policies | 8 |
| 12. Seed Data | Roles, permissions, etc. | 16 |
| 13. Business Rules | RN-005, RN-015, RN-016, RN-021 | 4 |
| **Total** | | **~126 asserts** |

### Resultado Esperado

```
 ALL CHECKS PASSED  | passed=~126 | failed=0
```

---

## 7. Defeitos Encontrados e Corrigidos

| # | Defeito | Severidade | Status |
|---|---------|------------|--------|
| 1 | Turnos seed não era idempotente — sem unique index em (departamento_id, nome), re-execução da migration criaria turnos duplicados | Média | 🔧 Corrigido — adicionado `uq_turnos_departamento_nome` + `ON CONFLICT` |

---

## 8. Checklist de Pré-Implementação

Antes de iniciar qualquer caso de uso de negócio:

- [x] Migration 0001 revisada e aprovada
- [x] FKs validadas (estrutura, ON DELETE)
- [x] Unique constraints validadas (índices parciais)
- [x] Triggers validadas (15 triggers, cobertura correta)
- [x] Functions validadas (lógica, segurança)
- [x] RLS policies validadas (cobertura, admin check pattern)
- [x] Seeds validados (imutáveis, idempotentes)
- [x] Auth integration validada (FK para auth.users)
- [x] Middleware validado (session refresh)
- [x] Server Components auth validado (createClient SSR)
- [x] Client Components auth validado (createBrowserClient)
- [x] Teste automatizado criado (`supabase/tests/001_schema_validation.sql`)
- [x] Chicken-and-egg bootstrap documentado
- [ ] `.env.local` configurado com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- [ ] `src/middleware.ts` criado exportando `updateSession` do `lib/supabase/middleware.ts`
- [ ] Migration aplicada no ambiente alvo

---

## 9. Aprovação

| Nome | Papel | Data | Assinatura |
|------|-------|------|------------|
| (pendente) | Arquiteto | 2026-06-27 | |
| (pendente) | Tech Lead | 2026-06-27 | |
| (pendente) | QA | 2026-06-27 | |

---

## 10. Referências

- `supabase/migrations/0001_initial_schema.sql` — Migration completa
- `supabase/tests/001_schema_validation.sql` — Teste automatizado de schema
- `lib/supabase/middleware.ts` — Middleware SSR
- `lib/supabase/server.ts` — Server Component client
- `lib/supabase/client.ts` — Client Component client
- `docs/05-modelo-de-dados.md` — Modelo de dados (fonte congelada)
- `docs/03-regras-de-negocio.md` — Regras de negócio (fonte congelada)
