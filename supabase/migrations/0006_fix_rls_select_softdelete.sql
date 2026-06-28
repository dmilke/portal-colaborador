-- Fix RLS SELECT policies to allow viewing soft-deleted rows for admins.
-- Without this, PostgREST fails to return updated rows after soft DELETE
-- because the new row no longer passes the `deleted_at IS NULL` filter,
-- causing "new row violates row-level security policy" (42501).

-- cargos
DROP POLICY IF EXISTS cargos_select ON cargos;
CREATE POLICY cargos_select ON cargos
  FOR SELECT
  TO authenticated
  USING (
    deleted_at IS NULL
    OR is_admin()
  );

-- unidades
DROP POLICY IF EXISTS unidades_select ON unidades;
CREATE POLICY unidades_select ON unidades
  FOR SELECT
  TO authenticated
  USING (
    deleted_at IS NULL
    OR is_admin()
  );

-- departamentos
DROP POLICY IF EXISTS departamentos_select ON departamentos;
CREATE POLICY departamentos_select ON departamentos
  FOR SELECT
  TO authenticated
  USING (
    deleted_at IS NULL
    OR is_admin()
  );

-- turnos
DROP POLICY IF EXISTS turnos_select ON turnos;
CREATE POLICY turnos_select ON turnos
  FOR SELECT
  TO authenticated
  USING (
    deleted_at IS NULL
    OR is_admin()
  );
