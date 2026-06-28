-- Create a SECURITY DEFINER function to check if current user has admin role
-- This bypasses RLS to avoid infinite recursion in policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM colaborador_roles cr
    JOIN roles r ON r.id = cr.role_id
    WHERE cr.colaborador_id = current_colaborador_id()
      AND r.nome = 'admin'
  );
$$;

-- Drop and recreate policies that were causing infinite recursion
DROP POLICY IF EXISTS colaboradores_select ON colaboradores;
CREATE POLICY colaboradores_select ON colaboradores
  FOR SELECT
  TO authenticated
  USING (
    id = current_colaborador_id()
    OR is_admin()
  );

DROP POLICY IF EXISTS colaborador_roles_select_own ON colaborador_roles;
CREATE POLICY colaborador_roles_select_own ON colaborador_roles
  FOR SELECT
  TO authenticated
  USING (
    colaborador_id = current_colaborador_id()
    OR is_admin()
  );

-- Fix DELETE policies
DROP POLICY IF EXISTS colaboradores_delete_admin ON colaboradores;
CREATE POLICY colaboradores_delete_admin ON colaboradores
  FOR DELETE
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS colaborador_roles_delete_admin ON colaborador_roles;
CREATE POLICY colaborador_roles_delete_admin ON colaborador_roles
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix UPDATE policies
DROP POLICY IF EXISTS colaboradores_update_self_or_admin ON colaboradores;
CREATE POLICY colaboradores_update_self_or_admin ON colaboradores
  FOR UPDATE
  TO authenticated
  USING (
    id = current_colaborador_id()
    OR is_admin()
  )
  WITH CHECK (
    id = current_colaborador_id()
    OR is_admin()
  );

-- Also fix permissions and role_permissions policies that reference admin
DROP POLICY IF EXISTS permissions_delete_admin ON permissions;
CREATE POLICY permissions_delete_admin ON permissions
  FOR DELETE
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS permissions_update_admin ON permissions;
CREATE POLICY permissions_update_admin ON permissions
  FOR UPDATE
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS role_permissions_delete_admin ON role_permissions;
CREATE POLICY role_permissions_delete_admin ON role_permissions
  FOR DELETE
  TO authenticated
  USING (is_admin());
