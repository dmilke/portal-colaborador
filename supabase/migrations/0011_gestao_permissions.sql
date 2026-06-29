-- ============================================================================
-- Portal do Colaborador — Migration 0011: Gestão (Management Center) permissions
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Insert gestao.read permission
-- --------------------------------------------------------------------------
INSERT INTO permissions (nome, descricao, module, grupo) VALUES
  ('gestao.read', 'Acessar Centro de Gestão', 'gestao', 'admin')
ON CONFLICT (nome) WHERE is_active = TRUE DO NOTHING;

-- --------------------------------------------------------------------------
-- 2. Assign to admin role
-- --------------------------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'admin'
  AND p.nome = 'gestao.read'
ON CONFLICT DO NOTHING;
