-- Seed cargos module permissions
INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'cargos.read', 'Visualizar cargos', 'cargos', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'cargos.read');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'cargos.create', 'Criar cargos', 'cargos', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'cargos.create');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'cargos.update', 'Editar cargos', 'cargos', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'cargos.update');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'cargos.delete', 'Excluir cargos', 'cargos', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'cargos.delete');

-- Assign cargos permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'admin'
  AND p.nome LIKE 'cargos.%'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );
