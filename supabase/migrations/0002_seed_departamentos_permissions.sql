-- Seed departamentos module permissions
INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'departamentos.read', 'Visualizar departamentos', 'departamentos', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'departamentos.read');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'departamentos.create', 'Criar departamentos', 'departamentos', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'departamentos.create');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'departamentos.update', 'Editar departamentos', 'departamentos', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'departamentos.update');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'departamentos.delete', 'Excluir departamentos', 'departamentos', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'departamentos.delete');

-- Assign departamentos permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'admin'
  AND p.nome LIKE 'departamentos.%'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );
