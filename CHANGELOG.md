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
