-- ============================================================================
-- Portal do Colaborador — Migration 0010: Shared Audience & Document Management
-- ============================================================================
-- 1. Extend document_status enum with publication workflow values
-- 2. Create shared audiencias table (polymorphic — comunicado, documento, etc.)
-- 3. Migrate data from comunicado_audiencias → audiencias, drop old table
-- 4. Create documento_leitura table
-- 5. Add columns to documento_versoes (titulo, descricao, is_current)
-- 6. Add publication columns to documentos
-- 7. Create document version archive table
-- 8. Fix RLS for documentos (soft-delete visibility)
-- 9. Seed documentos.* permissions
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Extend document_status enum
-- --------------------------------------------------------------------------
ALTER TYPE document_status ADD VALUE IF NOT EXISTS 'rascunho';
ALTER TYPE document_status ADD VALUE IF NOT EXISTS 'publicado';
ALTER TYPE document_status ADD VALUE IF NOT EXISTS 'arquivado';
ALTER TYPE document_status ADD VALUE IF NOT EXISTS 'expirado';

-- --------------------------------------------------------------------------
-- 2. Create shared audiencias table (polymorphic)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audiencias (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    entidade_tipo   VARCHAR(50) NOT NULL,
    entidade_id     UUID        NOT NULL,
    tipo            VARCHAR(20) NOT NULL,
    alvo_id         UUID        NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audiencias_entidade
    ON audiencias (entidade_tipo, entidade_id);

ALTER TABLE audiencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audiencias_select" ON audiencias
    FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "audiencias_insert_admin" ON audiencias
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id
                WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
    );

CREATE POLICY "audiencias_update_admin" ON audiencias
    FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id
                WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
    );

CREATE POLICY "audiencias_delete_admin" ON audiencias
    FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id
                WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
    );

-- --------------------------------------------------------------------------
-- 3. Migrate from comunicado_audiencias → audiencias, drop old table
-- --------------------------------------------------------------------------
INSERT INTO audiencias (entidade_tipo, entidade_id, tipo, alvo_id, created_at)
SELECT 'comunicado', comunicado_id, tipo, alvo_id, created_at
FROM comunicado_audiencias
ON CONFLICT DO NOTHING;

DROP TABLE IF EXISTS comunicado_audiencias;

-- --------------------------------------------------------------------------
-- 4. Create documento_leitura table
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documento_leitura (
    documento_id    UUID        NOT NULL,
    colaborador_id  UUID        NOT NULL,
    lido_em         TIMESTAMPTZ NOT NULL DEFAULT now(),
    download_em     TIMESTAMPTZ,
    PRIMARY KEY (documento_id, colaborador_id)
);

ALTER TABLE documento_leitura
    ADD CONSTRAINT fk_documento_leitura_documento
    FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE CASCADE;

ALTER TABLE documento_leitura
    ADD CONSTRAINT fk_documento_leitura_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE;

ALTER TABLE documento_leitura ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documento_leitura_select_own" ON documento_leitura
    FOR SELECT TO authenticated USING (
        colaborador_id = current_colaborador_id()
    );

CREATE POLICY "documento_leitura_insert_own" ON documento_leitura
    FOR INSERT TO authenticated WITH CHECK (
        colaborador_id = current_colaborador_id()
    );

COMMENT ON TABLE documento_leitura IS 'Tracking which collaborators read/downloaded which documents';

-- --------------------------------------------------------------------------
-- 5. Add content-tracking columns to documento_versoes
-- --------------------------------------------------------------------------
ALTER TABLE documento_versoes ADD COLUMN IF NOT EXISTS titulo VARCHAR(255);
ALTER TABLE documento_versoes ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE documento_versoes ADD COLUMN IF NOT EXISTS is_current BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_documento_versoes_current
    ON documento_versoes (documento_id)
    WHERE is_current = TRUE;

-- --------------------------------------------------------------------------
-- 6. Add publication columns to documentos
-- --------------------------------------------------------------------------
ALTER TABLE documentos ADD COLUMN IF NOT EXISTS categoria VARCHAR(50);
ALTER TABLE documentos ADD COLUMN IF NOT EXISTS publicacao_em TIMESTAMPTZ;
ALTER TABLE documentos ADD COLUMN IF NOT EXISTS expiracao_em TIMESTAMPTZ;

ALTER TABLE documentos ALTER COLUMN status SET DEFAULT 'rascunho';

-- Update existing 'pendente' documents to 'rascunho' for consistency
UPDATE documentos SET status = 'rascunho' WHERE status = 'pendente';

-- --------------------------------------------------------------------------
-- 7. Fix RLS for documentos — admins see all (including soft-deleted)
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS "documentos_select" ON documentos;
CREATE POLICY "documentos_select" ON documentos
    FOR SELECT TO authenticated USING (
        deleted_at IS NULL OR is_admin()
    );

-- --------------------------------------------------------------------------
-- 8. Seed permissions
-- --------------------------------------------------------------------------
INSERT INTO permissions (nome, descricao, module, grupo) VALUES
    ('documentos.read',      'Visualizar documentos',               'documentos', 'admin'),
    ('documentos.create',    'Criar novos documentos',              'documentos', 'admin'),
    ('documentos.update',    'Editar documentos existentes',        'documentos', 'admin'),
    ('documentos.delete',    'Excluir (soft-delete) documentos',    'documentos', 'admin'),
    ('documentos.publish',   'Publicar documentos',                 'documentos', 'admin'),
    ('documentos.archive',   'Arquivar/restaurar documentos',       'documentos', 'admin'),
    ('documentos.version',   'Gerenciar versões de documentos',     'documentos', 'admin')
ON CONFLICT (nome) WHERE is_active = TRUE DO NOTHING;

-- Assign to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'admin'
  AND p.nome LIKE 'documentos.%'
ON CONFLICT DO NOTHING;

-- Assign read to colaborador role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'colaborador'
  AND p.nome = 'documentos.read'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF MIGRATION 0010
-- ============================================================================
