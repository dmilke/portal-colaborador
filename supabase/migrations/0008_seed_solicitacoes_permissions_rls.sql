-- ============================================================================
-- Portal do Colaborador — Migration 0008: Solicitações Permissions & RLS fix
-- ============================================================================
-- 1. Replace old `solicitacao.*` permissions with `solicitacoes.*`
-- 2. Assign to admin and colaborador roles
-- 3. Allow any authenticated user to insert into notificacoes
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Remove old role_permissions for solicitacao.*
-- --------------------------------------------------------------------------
DELETE FROM role_permissions
WHERE permission_id IN (
  SELECT id FROM permissions WHERE nome LIKE 'solicitacao.%'
);

-- --------------------------------------------------------------------------
-- 2. Delete old permissions
-- --------------------------------------------------------------------------
DELETE FROM permissions WHERE nome LIKE 'solicitacao.%';

-- --------------------------------------------------------------------------
-- 3. Insert new permissions (plural English convention)
-- --------------------------------------------------------------------------
INSERT INTO permissions (nome, descricao, module, grupo) VALUES
  ('solicitacoes.read',   'Visualizar solicitações de folga',     'solicitacoes', 'admin'),
  ('solicitacoes.create', 'Criar solicitação de folga',           'solicitacoes', 'colaborador'),
  ('solicitacoes.approve','Aprovar solicitação de folga',         'solicitacoes', 'admin'),
  ('solicitacoes.reject', 'Reprovar solicitação de folga',        'solicitacoes', 'admin'),
  ('solicitacoes.cancel', 'Cancelar solicitação de folga',        'solicitacoes', 'colaborador')
ON CONFLICT (nome) WHERE is_active = TRUE DO NOTHING;

-- --------------------------------------------------------------------------
-- 4. Assign all 5 to admin role
-- --------------------------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'admin'
  AND p.nome IN ('solicitacoes.read', 'solicitacoes.create', 'solicitacoes.approve', 'solicitacoes.reject', 'solicitacoes.cancel')
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 5. Assign read + create + cancel to colaborador role
-- --------------------------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'colaborador'
  AND p.nome IN ('solicitacoes.read', 'solicitacoes.create', 'solicitacoes.cancel')
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 6. Allow all authenticated users to insert notifications (system-generated)
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS "notificacoes_insert_system" ON notificacoes;

CREATE POLICY "notificacoes_insert_authenticated" ON notificacoes
  FOR INSERT TO authenticated WITH CHECK (TRUE);

-- ============================================================================
-- END OF MIGRATION 0008
-- ============================================================================
