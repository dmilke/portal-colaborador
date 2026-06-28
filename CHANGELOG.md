# Changelog

## v0.2.0-rc1 (2026-06-27)

### Sprint 1 — Foundation
- Auth (login/logout/session recovery) with Supabase SSR
- Application Shell (sidebar, header, breadcrumbs, mobile-nav, theme-toggle)
- RBAC data loading (colaborador + roles + permissions)
- Protected dashboard with real user data

### Sprint 2 — Dashboard & CRUDs
- Production Dashboard: 8 stats cards, recent activity timeline, quick actions
- Departamentos CRUD: list, create, edit with RBAC + Zod validation
- Auth repository fix: `codigo` → `nome` permissions column alias
- RLS recursion fix: `SECURITY DEFINER is_admin()` function (Migration 0004)

### Sprint 3 — Shared Components & Cargos
- 8 reusable admin components (AdminPageLayout, DataTable, etc.)
- Cargos full CRUD following Departamentos pattern
- Dashboard: cards as `<Link>` tags, Quick Actions use `window.location.href`
- Auth: login redirect `/dashboard` → `/`, sidebar link `/dashboard` → `/`
- Proxy middleware protects all non-public routes, preserves Supabase cookies
- FK join name fixes (`use-auth.ts`, `lookupColaborador`)
- Shared `checkPermission()` helper extracted

### RC 0.2.0 — Hardening
- `verifySession()` removed (dead code)
- `setAll` catch block logs errors instead of swallowing silently
- DropdownMenuTrigger renders its own `<button>` (no more nested buttons)
- 56 scaffold placeholder stub files removed
- `@tanstack/react-table` removed (unused dependency)
- Removed noop `<Suspense>` wrappers from Cargos and Departamentos pages
- `_headers` unused parameter warning fixed

## v0.2.0-rc2 (2026-06-28)

### Sprint 4 — Unidades Module
- Unidades CRUD: full create, read, update, soft-delete with RBAC + Zod validation
- 3 new routes: `/unidades`, `/unidades/novo`, `/unidades/[id]`
- New feature module: schemas, validators, repository, service, actions (5 Server Actions), components (form + table)
- Reuses 100% of the admin CRUD platform (DataTable, AdminToolbar, AdminPageLayout, AdminStatusBadge, AdminConfirmDialog, AdminActionButtons)
- Seed migration 0005: 4 new permissions (`unidades.read/create/update/delete`) assigned to admin role
- Screenshots in `docs/screenshots/Sprint-04/`

### Sprint 5 — Colaboradores Module
- Colaboradores full CRUD: create, read, update, soft-delete with RBAC + Zod validation
- 3 new routes: `/colaboradores`, `/colaboradores/novo`, `/colaboradores/[id]`
- 15+ fields per migration 0001 (nome, matrícula, CPF, email, telefone, data_nascimento, data_admissão, genero, estado_civil, departamento, cargo, unidade)
- CPF validation with proper algorithm (`src/shared/lib/cpf.ts`)
- Zod schemas for all fields with CPF, email, phone validation
- Unique constraints on matrícula, CPF, and email (checked in service)
- Role assignment UI with `ColaboradorRoles` component
- Auth integration: invite user, activate/deactivate auth.users via Supabase Admin API
- Profile view with avatar, vínculos (departamento/cargo/unidade), roles, status
- RBAC: 4 permissions (`colaboradores.read/create/update/delete`) seeded via migration 0007
- RLS fix migrated from Sprint 4 (migration 0006) — admins see all rows including soft-deleted
- Reuses admin CRUD platform (DataTable, AdminToolbar, AdminPageLayout, AdminStatusBadge, AdminConfirmDialog, AdminActionButtons)
- Supabase admin client for auth operations (`lib/supabase/admin.ts`)
- Seed migration 0007: 4 permissions assigned to admin role
- Screenshots in `docs/screenshots/Sprint-05/` (desktop + mobile)
