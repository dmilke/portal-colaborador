-- Seed unidades module permissions
INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'unidades.read', 'Visualizar unidades', 'unidades', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'unidades.read');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'unidades.create', 'Criar unidades', 'unidades', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'unidades.create');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'unidades.update', 'Editar unidades', 'unidades', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'unidades.update');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'unidades.delete', 'Excluir unidades', 'unidades', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'unidades.delete');

-- Assign unidades permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'admin'
  AND p.nome LIKE 'unidades.%'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );
