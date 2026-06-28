-- Seed colaboradores module permissions
INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'colaboradores.read', 'Visualizar colaboradores', 'colaboradores', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'colaboradores.read');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'colaboradores.create', 'Criar colaboradores', 'colaboradores', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'colaboradores.create');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'colaboradores.update', 'Editar colaboradores', 'colaboradores', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'colaboradores.update');

INSERT INTO permissions (nome, descricao, module, grupo, is_active)
SELECT 'colaboradores.delete', 'Excluir colaboradores', 'colaboradores', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE nome = 'colaboradores.delete');

-- Assign colaboradores permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'admin'
  AND p.nome LIKE 'colaboradores.%'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );
