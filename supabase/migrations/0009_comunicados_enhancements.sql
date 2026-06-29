-- ============================================================================
-- Portal do Colaborador — Migration 0009: Comunicados enhancements
-- ============================================================================
-- 1. Add categoria, prioridade, is_pinned columns
-- 2. Create comunicado_audiencias table for audience targeting
-- 3. Fix RLS SELECT for soft-delete visibility
-- 4. Seed comunicados.* permissions
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Add new columns to comunicados
-- --------------------------------------------------------------------------
ALTER TABLE comunicados ADD COLUMN IF NOT EXISTS categoria VARCHAR(50);
ALTER TABLE comunicados ADD COLUMN IF NOT EXISTS prioridade VARCHAR(20) NOT NULL DEFAULT 'normal';
ALTER TABLE comunicados ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT FALSE;

-- --------------------------------------------------------------------------
-- 2. Create comunicado_audiencias table
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comunicado_audiencias (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    comunicado_id   UUID        NOT NULL,
    tipo            VARCHAR(20) NOT NULL,
    alvo_id         UUID        NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FK
ALTER TABLE comunicado_audiencias
    ADD CONSTRAINT fk_comunicado_audiencias_comunicado
    FOREIGN KEY (comunicado_id) REFERENCES comunicados(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comunicado_audiencias_comunicado
    ON comunicado_audiencias (comunicado_id);

-- RLS
ALTER TABLE comunicado_audiencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comunicado_audiencias_select" ON comunicado_audiencias
    FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "comunicado_audiencias_insert_admin" ON comunicado_audiencias
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id
                WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
    );

CREATE POLICY "comunicado_audiencias_update_admin" ON comunicado_audiencias
    FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id
                WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
    );

CREATE POLICY "comunicado_audiencias_delete_admin" ON comunicado_audiencias
    FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id
                WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
    );

-- --------------------------------------------------------------------------
-- 3. Pin index
-- --------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_comunicados_pinned
    ON comunicados (is_pinned)
    WHERE is_pinned = TRUE AND deleted_at IS NULL;

-- --------------------------------------------------------------------------
-- 4. Fix RLS SELECT — admins see soft-deleted rows
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS "comunicados_select" ON comunicados;
CREATE POLICY "comunicados_select" ON comunicados
    FOR SELECT TO authenticated USING (
        deleted_at IS NULL OR is_admin()
    );

-- --------------------------------------------------------------------------
-- 5. Seed permissions
-- --------------------------------------------------------------------------
INSERT INTO permissions (nome, descricao, module, grupo) VALUES
    ('comunicados.read',   'Visualizar comunicados',              'comunicados', 'admin'),
    ('comunicados.create', 'Criar novos comunicados',             'comunicados', 'admin'),
    ('comunicados.update', 'Editar comunicados existentes',       'comunicados', 'admin'),
    ('comunicados.delete', 'Excluir (soft-delete) comunicados',   'comunicados', 'admin')
ON CONFLICT (nome) WHERE is_active = TRUE DO NOTHING;

-- Assign all 4 to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'admin'
  AND p.nome IN ('comunicados.read', 'comunicados.create', 'comunicados.update', 'comunicados.delete')
ON CONFLICT DO NOTHING;

-- Assign read to colaborador role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'colaborador'
  AND p.nome = 'comunicados.read'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF MIGRATION 0009
-- ============================================================================
