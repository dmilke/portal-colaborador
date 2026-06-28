-- ============================================================================
-- Portal do Colaborador — Migration 0001: Initial Schema
-- ============================================================================
-- Order: EXTENSION → ENUMS → TABLES → CONSTRAINTS → FOREIGN KEYS
--        → INDEXES → FUNCTIONS → TRIGGERS → RLS ENABLE → RLS POLICIES
--        → COMMENTS → SEEDS
-- ============================================================================

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 0. EXTENSIONS
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 1. ENUMS
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

CREATE TYPE request_status AS ENUM (
    'pendente',
    'aprovada',
    'reprovada',
    'cancelada',
    'expirada'
);

CREATE TYPE acao_tipo AS ENUM (
    'login',
    'cadastro',
    'alteracao',
    'solicitacao',
    'aprovacao',
    'reprovacao',
    'cancelamento',
    'alteracao_equipe',
    'alteracao_configuracoes'
);

CREATE TYPE document_status AS ENUM (
    'pendente',
    'assinado',
    'cancelado'
);

CREATE TYPE signature_type AS ENUM (
    'eletronica',
    'digital'
);

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 2. TABLES
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- --------------------------------------------------------------------------
-- 2.1  RBAC
-- --------------------------------------------------------------------------

CREATE TABLE roles (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(100) NOT NULL,
    descricao   TEXT,
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE permissions (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(100) NOT NULL,
    descricao   TEXT,
    module      VARCHAR(50),
    grupo       VARCHAR(50),
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
    role_id       UUID        NOT NULL,
    permission_id UUID        NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE colaborador_roles (
    colaborador_id UUID        NOT NULL,
    role_id        UUID        NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (colaborador_id, role_id)
);

-- --------------------------------------------------------------------------
-- 2.2  Organograma
-- --------------------------------------------------------------------------

CREATE TABLE departamentos (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(100) NOT NULL,
    descricao   TEXT,
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by  UUID,
    updated_by  UUID,
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE unidades (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(100) NOT NULL,
    sigla       VARCHAR(20),
    endereco    TEXT,
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by  UUID,
    updated_by  UUID,
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE cargos (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(100) NOT NULL,
    descricao   TEXT,
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by  UUID,
    updated_by  UUID,
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE turnos (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    departamento_id UUID        NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    descricao       TEXT,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMPTZ
);

-- --------------------------------------------------------------------------
-- 2.3  Core
-- --------------------------------------------------------------------------

CREATE TABLE colaboradores (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id    UUID        UNIQUE,
    matricula       VARCHAR(50) UNIQUE,
    nome            VARCHAR(255) NOT NULL,
    cpf             VARCHAR(11) UNIQUE,
    email           VARCHAR(255) UNIQUE,
    telefone        VARCHAR(20),
    data_nascimento DATE,
    data_admissao   DATE,
    avatar_url      TEXT,
    genero          VARCHAR(20),
    estado_civil    VARCHAR(20),
    departamento_id UUID,
    unidade_id      UUID,
    cargo_id        UUID,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE historico_lotacao (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    colaborador_id  UUID        NOT NULL,
    departamento_id UUID        NOT NULL,
    turno_id        UUID,
    data_inicio     DATE        NOT NULL,
    data_fim        DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID
);

-- --------------------------------------------------------------------------
-- 2.4  Workflow (stubs for future expansion)
-- --------------------------------------------------------------------------

CREATE TABLE workflow_definitions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nome            VARCHAR(100) NOT NULL,
    descricao       TEXT,
    entidade_tipo   VARCHAR(50) NOT NULL,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE workflow_steps (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id  UUID        NOT NULL,
    nome                    VARCHAR(100) NOT NULL,
    ordem                   INTEGER     NOT NULL,
    is_terminal             BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by              UUID,
    updated_by              UUID,
    deleted_at              TIMESTAMPTZ
);

-- --------------------------------------------------------------------------
-- 2.5  Domain (Solicitações)
-- --------------------------------------------------------------------------

CREATE TABLE tipos_folga (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nome              VARCHAR(100) NOT NULL,
    descricao         TEXT,
    requer_aprovacao  BOOLEAN     NOT NULL DEFAULT TRUE,
    is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by        UUID,
    updated_by        UUID,
    deleted_at        TIMESTAMPTZ
);

CREATE TABLE datas_bloqueadas (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    data            DATE        NOT NULL,
    motivo          TEXT,
    departamento_id UUID,
    unidade_id      UUID,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE solicitacoes (
    id                      UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    colaborador_id          UUID          NOT NULL,
    tipo_folga_id           UUID          NOT NULL,
    workflow_definition_id  UUID,
    workflow_step_id        UUID,
    data_folga              DATE          NOT NULL,
    turno_id                UUID          NOT NULL,
    status                  request_status NOT NULL DEFAULT 'pendente',
    justificativa           TEXT,
    observacao_rh           TEXT,
    solicitado_em           TIMESTAMPTZ   NOT NULL DEFAULT now(),
    aprovado_em             TIMESTAMPTZ,
    aprovado_por            UUID,
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ   NOT NULL DEFAULT now(),
    created_by              UUID,
    updated_by              UUID,
    deleted_at              TIMESTAMPTZ
);

-- --------------------------------------------------------------------------
-- 2.6  Communications
-- --------------------------------------------------------------------------

CREATE TABLE notificacoes (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    colaborador_id  UUID        NOT NULL,
    solicitacao_id  UUID,
    titulo          VARCHAR(255) NOT NULL,
    mensagem        TEXT        NOT NULL,
    tipo            VARCHAR(50),
    payload         JSONB,
    lida            BOOLEAN     NOT NULL DEFAULT FALSE,
    lida_em         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE comunicados (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo          VARCHAR(255) NOT NULL,
    conteudo        TEXT        NOT NULL,
    autor_id        UUID        NOT NULL,
    departamento_id UUID,
    unidade_id      UUID,
    publicacao_em   TIMESTAMPTZ,
    expiracao_em    TIMESTAMPTZ,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE comunicado_leitura (
    comunicado_id   UUID        NOT NULL,
    colaborador_id  UUID        NOT NULL,
    lido_em         TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (comunicado_id, colaborador_id)
);

-- --------------------------------------------------------------------------
-- 2.7  Documents
-- --------------------------------------------------------------------------

CREATE TABLE documentos (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo          VARCHAR(255)    NOT NULL,
    descricao       TEXT,
    tipo            VARCHAR(50)     NOT NULL,
    status          document_status NOT NULL DEFAULT 'pendente',
    colaborador_id  UUID,
    departamento_id UUID,
    unidade_id      UUID,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE documento_versoes (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    documento_id    UUID        NOT NULL,
    versao          INTEGER     NOT NULL,
    arquivo_url     TEXT        NOT NULL,
    bucket          VARCHAR(100) NOT NULL,
    checksum        VARCHAR(64),
    tamanho_bytes   BIGINT,
    mime_type       VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID
);

CREATE TABLE documento_assinaturas (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    documento_id    UUID           NOT NULL,
    colaborador_id  UUID           NOT NULL,
    tipo            signature_type NOT NULL DEFAULT 'eletronica',
    assinado_em     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2.8  Attachments (polymorphic)
-- --------------------------------------------------------------------------

CREATE TABLE anexos (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    entidade_tipo VARCHAR(50) NOT NULL,
    entidade_id   UUID        NOT NULL,
    nome_arquivo  VARCHAR(255) NOT NULL,
    arquivo_url   TEXT        NOT NULL,
    bucket        VARCHAR(100) NOT NULL,
    mime_type     VARCHAR(100),
    tamanho_bytes BIGINT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by    UUID
);

-- --------------------------------------------------------------------------
-- 2.9  System
-- --------------------------------------------------------------------------

CREATE TABLE auditoria (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    colaborador_id  UUID,
    acao            acao_tipo   NOT NULL,
    entidade_tipo   VARCHAR(50) NOT NULL,
    entidade_id     UUID,
    descricao       TEXT,
    valor_anterior  JSONB,
    valor_novo      JSONB,
    request_id      UUID,
    user_agent      TEXT,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE configuracoes (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    chave       VARCHAR(100) NOT NULL,
    valor       TEXT        NOT NULL,
    tipo        VARCHAR(20) NOT NULL DEFAULT 'string',
    descricao   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by  UUID,
    updated_by  UUID
);

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 3. CONSTRAINTS (CHECK / UNIQUE)
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- RN-021: Unique active solicitation per collaborator/date/shift/leave-type
CREATE UNIQUE INDEX uq_solicitacoes_ativo
    ON solicitacoes (colaborador_id, data_folga, turno_id, tipo_folga_id)
    WHERE status NOT IN ('cancelada', 'reprovada', 'expirada')
      AND deleted_at IS NULL;

-- RN-005: One slot per department/date/shift (active requests only)
CREATE UNIQUE INDEX uq_solicitacoes_vaga
    ON solicitacoes (data_folga, turno_id)
    WHERE status IN ('pendente', 'aprovada')
      AND deleted_at IS NULL;

-- Unique configuration key
CREATE UNIQUE INDEX uq_configuracoes_chave
    ON configuracoes (chave);

-- Unique workflow step order per definition
CREATE UNIQUE INDEX uq_workflow_steps_ordem
    ON workflow_steps (workflow_definition_id, ordem)
    WHERE deleted_at IS NULL;

-- Unique version number per document
CREATE UNIQUE INDEX uq_documento_versoes_numero
    ON documento_versoes (documento_id, versao);

-- Unique active name per table (system reference tables)
CREATE UNIQUE INDEX uq_roles_nome ON roles (nome) WHERE is_active = TRUE;
CREATE UNIQUE INDEX uq_permissions_nome ON permissions (nome) WHERE is_active = TRUE;
CREATE UNIQUE INDEX uq_departamentos_nome ON departamentos (nome) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_unidades_nome ON unidades (nome) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_cargos_nome ON cargos (nome) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_tipos_folga_nome ON tipos_folga (nome) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_turnos_departamento_nome ON turnos (departamento_id, nome) WHERE deleted_at IS NULL;

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 4. FOREIGN KEYS
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- RBAC
ALTER TABLE role_permissions
    ADD CONSTRAINT fk_role_permissions_role
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;

ALTER TABLE role_permissions
    ADD CONSTRAINT fk_role_permissions_permission
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE;

ALTER TABLE colaborador_roles
    ADD CONSTRAINT fk_colaborador_roles_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE;

ALTER TABLE colaborador_roles
    ADD CONSTRAINT fk_colaborador_roles_role
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;

-- Organograma
ALTER TABLE turnos
    ADD CONSTRAINT fk_turnos_departamento
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE RESTRICT;

-- Core
ALTER TABLE colaboradores
    ADD CONSTRAINT fk_colaboradores_auth_user
    FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE colaboradores
    ADD CONSTRAINT fk_colaboradores_departamento
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE SET NULL;

ALTER TABLE colaboradores
    ADD CONSTRAINT fk_colaboradores_unidade
    FOREIGN KEY (unidade_id) REFERENCES unidades(id) ON DELETE SET NULL;

ALTER TABLE colaboradores
    ADD CONSTRAINT fk_colaboradores_cargo
    FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE SET NULL;

ALTER TABLE historico_lotacao
    ADD CONSTRAINT fk_historico_lotacao_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE;

ALTER TABLE historico_lotacao
    ADD CONSTRAINT fk_historico_lotacao_departamento
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE RESTRICT;

ALTER TABLE historico_lotacao
    ADD CONSTRAINT fk_historico_lotacao_turno
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE SET NULL;

-- Workflow
ALTER TABLE workflow_steps
    ADD CONSTRAINT fk_workflow_steps_definition
    FOREIGN KEY (workflow_definition_id) REFERENCES workflow_definitions(id) ON DELETE CASCADE;

-- Domain
ALTER TABLE solicitacoes
    ADD CONSTRAINT fk_solicitacoes_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE RESTRICT;

ALTER TABLE solicitacoes
    ADD CONSTRAINT fk_solicitacoes_tipo_folga
    FOREIGN KEY (tipo_folga_id) REFERENCES tipos_folga(id) ON DELETE RESTRICT;

ALTER TABLE solicitacoes
    ADD CONSTRAINT fk_solicitacoes_turno
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE RESTRICT;

ALTER TABLE solicitacoes
    ADD CONSTRAINT fk_solicitacoes_workflow_definition
    FOREIGN KEY (workflow_definition_id) REFERENCES workflow_definitions(id) ON DELETE SET NULL;

ALTER TABLE solicitacoes
    ADD CONSTRAINT fk_solicitacoes_workflow_step
    FOREIGN KEY (workflow_step_id) REFERENCES workflow_steps(id) ON DELETE SET NULL;

ALTER TABLE solicitacoes
    ADD CONSTRAINT fk_solicitacoes_aprovado_por
    FOREIGN KEY (aprovado_por) REFERENCES colaboradores(id) ON DELETE SET NULL;

-- Communications
ALTER TABLE notificacoes
    ADD CONSTRAINT fk_notificacoes_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE;

ALTER TABLE notificacoes
    ADD CONSTRAINT fk_notificacoes_solicitacao
    FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id) ON DELETE CASCADE;

ALTER TABLE comunicados
    ADD CONSTRAINT fk_comunicados_autor
    FOREIGN KEY (autor_id) REFERENCES colaboradores(id) ON DELETE RESTRICT;

ALTER TABLE comunicados
    ADD CONSTRAINT fk_comunicados_departamento
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE SET NULL;

ALTER TABLE comunicados
    ADD CONSTRAINT fk_comunicados_unidade
    FOREIGN KEY (unidade_id) REFERENCES unidades(id) ON DELETE SET NULL;

ALTER TABLE comunicado_leitura
    ADD CONSTRAINT fk_comunicado_leitura_comunicado
    FOREIGN KEY (comunicado_id) REFERENCES comunicados(id) ON DELETE CASCADE;

ALTER TABLE comunicado_leitura
    ADD CONSTRAINT fk_comunicado_leitura_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE;

-- Documents
ALTER TABLE documentos
    ADD CONSTRAINT fk_documentos_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE SET NULL;

ALTER TABLE documentos
    ADD CONSTRAINT fk_documentos_departamento
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE SET NULL;

ALTER TABLE documentos
    ADD CONSTRAINT fk_documentos_unidade
    FOREIGN KEY (unidade_id) REFERENCES unidades(id) ON DELETE SET NULL;

ALTER TABLE documento_versoes
    ADD CONSTRAINT fk_documento_versoes_documento
    FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE CASCADE;

ALTER TABLE documento_assinaturas
    ADD CONSTRAINT fk_documento_assinaturas_documento
    FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE CASCADE;

ALTER TABLE documento_assinaturas
    ADD CONSTRAINT fk_documento_assinaturas_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE;

-- Audit / created_by / updated_by FKs
-- These use ON DELETE SET NULL so business data survives user deletion.

DO $$
DECLARE
    tbl TEXT;
    tables_with_audit TEXT[] := ARRAY[
        'departamentos', 'unidades', 'cargos', 'turnos',
        'colaboradores',
        'workflow_definitions', 'workflow_steps',
        'tipos_folga', 'datas_bloqueadas', 'solicitacoes',
        'notificacoes', 'comunicados',
        'documentos',
        'configuracoes'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables_with_audit
    LOOP
        EXECUTE format(
            'ALTER TABLE %I ADD CONSTRAINT fk_%s_created_by FOREIGN KEY (created_by) REFERENCES colaboradores(id) ON DELETE SET NULL',
            tbl, tbl
        );
        EXECUTE format(
            'ALTER TABLE %I ADD CONSTRAINT fk_%s_updated_by FOREIGN KEY (updated_by) REFERENCES colaboradores(id) ON DELETE SET NULL',
            tbl, tbl
        );
    END LOOP;
END $$;

-- Additional created_by FKs (no updated_by)
ALTER TABLE historico_lotacao
    ADD CONSTRAINT fk_historico_lotacao_created_by
    FOREIGN KEY (created_by) REFERENCES colaboradores(id) ON DELETE SET NULL;

ALTER TABLE documento_versoes
    ADD CONSTRAINT fk_documento_versoes_created_by
    FOREIGN KEY (created_by) REFERENCES colaboradores(id) ON DELETE SET NULL;

ALTER TABLE anexos
    ADD CONSTRAINT fk_anexos_created_by
    FOREIGN KEY (created_by) REFERENCES colaboradores(id) ON DELETE SET NULL;

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 5. INDEXES
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- Performance indexes for search and filtering
CREATE INDEX idx_colaboradores_departamento ON colaboradores (departamento_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_colaboradores_unidade ON colaboradores (unidade_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_colaboradores_cargo ON colaboradores (cargo_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_historico_lotacao_colaborador ON historico_lotacao (colaborador_id);
CREATE INDEX idx_historico_lotacao_periodo ON historico_lotacao (data_inicio, data_fim);

CREATE INDEX idx_turnos_departamento ON turnos (departamento_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_solicitacoes_colaborador ON solicitacoes (colaborador_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_solicitacoes_data ON solicitacoes (data_folga) WHERE deleted_at IS NULL;
CREATE INDEX idx_solicitacoes_status ON solicitacoes (status) WHERE deleted_at IS NULL;
CREATE INDEX idx_solicitacoes_data_status ON solicitacoes (data_folga, status) WHERE deleted_at IS NULL;

CREATE INDEX idx_notificacoes_colaborador ON notificacoes (colaborador_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notificacoes_lida ON notificacoes (colaborador_id, lida) WHERE deleted_at IS NULL;

CREATE INDEX idx_comunicados_publicacao ON comunicados (publicacao_em) WHERE is_active = TRUE AND deleted_at IS NULL;

CREATE INDEX idx_documentos_colaborador ON documentos (colaborador_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documentos_tipo ON documentos (tipo) WHERE deleted_at IS NULL;

CREATE INDEX idx_documento_versoes_documento ON documento_versoes (documento_id);

CREATE INDEX idx_documento_assinaturas_documento ON documento_assinaturas (documento_id);
CREATE INDEX idx_documento_assinaturas_colaborador ON documento_assinaturas (colaborador_id);

CREATE INDEX idx_anexos_entidade ON anexos (entidade_tipo, entidade_id);

CREATE INDEX idx_auditoria_colaborador ON auditoria (colaborador_id);
CREATE INDEX idx_auditoria_acao ON auditoria (acao);
CREATE INDEX idx_auditoria_data ON auditoria (created_at);
CREATE INDEX idx_auditoria_entidade ON auditoria (entidade_tipo, entidade_id);

CREATE INDEX idx_datas_bloqueadas_data ON datas_bloqueadas (data) WHERE deleted_at IS NULL;
CREATE INDEX idx_datas_bloqueadas_departamento ON datas_bloqueadas (departamento_id) WHERE deleted_at IS NULL;

-- Partial indexes for soft-delete queries
CREATE INDEX idx_departamentos_active ON departamentos (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_unidades_active ON unidades (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_cargos_active ON cargos (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_turnos_active ON turnos (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_colaboradores_active ON colaboradores (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tipos_folga_active ON tipos_folga (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_datas_bloqueadas_active ON datas_bloqueadas (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_solicitacoes_active ON solicitacoes (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notificacoes_active ON notificacoes (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comunicados_active ON comunicados (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documentos_active ON documentos (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_workflow_definitions_active ON workflow_definitions (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_workflow_steps_active ON workflow_steps (id) WHERE deleted_at IS NULL;

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 6. FUNCTIONS
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- Returns the colaboradores.id for the currently authenticated user.
-- Uses SECURITY DEFINER to bypass RLS.
CREATE OR REPLACE FUNCTION current_colaborador_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT id FROM colaboradores WHERE auth_user_id = auth.uid() AND deleted_at IS NULL;
$$;

-- Trigger function: sets created_at / updated_at timestamps and
-- created_by / updated_by audit fields automatically.
CREATE OR REPLACE FUNCTION set_audit_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.created_at := now();
        NEW.updated_at := now();
        NEW.created_by := COALESCE(NEW.created_by, current_colaborador_id());
        NEW.updated_by := COALESCE(NEW.updated_by, current_colaborador_id());
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_at := now();
        NEW.updated_by := COALESCE(NEW.updated_by, current_colaborador_id());
        -- Preserve original created_at / created_by
        NEW.created_at := OLD.created_at;
        NEW.created_by := OLD.created_by;
    END IF;
    RETURN NEW;
END;
$$;

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 7. TRIGGERS
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- Apply set_audit_fields to every mutable business table.
DO $$
DECLARE
    tbl TEXT;
    tables_with_audit TEXT[] := ARRAY[
        'departamentos', 'unidades', 'cargos', 'turnos',
        'colaboradores',
        'workflow_definitions', 'workflow_steps',
        'tipos_folga', 'datas_bloqueadas', 'solicitacoes',
        'notificacoes', 'comunicados',
        'documentos',
        'configuracoes'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables_with_audit
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_audit BEFORE INSERT OR UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_audit_fields()',
            tbl, tbl
        );
    END LOOP;
END $$;

-- Trigger to keep historico_lotacao.created_by updated
CREATE TRIGGER trg_historico_lotacao_audit
    BEFORE INSERT ON historico_lotacao
    FOR EACH ROW
    EXECUTE FUNCTION set_audit_fields();

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 8. RLS ENABLE
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE colaborador_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_lotacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_folga ENABLE ROW LEVEL SECURITY;
ALTER TABLE datas_bloqueadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunicado_leitura ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documento_versoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documento_assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 9. RLS POLICIES
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- Helper: a role-based check is done via colaborador_roles join.
-- For MVP simplicity we define broad policies; refinement happens
-- when the admin/colaborador UI roles are fully implemented.

-- Administrators have full access via a role named 'admin'.
-- Collaborators see only their own data.

-- 9.1  RBAC tables — only administrators can mutate; authenticated users can read.

CREATE POLICY "roles_select_authenticated" ON roles FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "roles_insert_admin" ON roles FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "roles_update_admin" ON roles FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "roles_delete_admin" ON roles FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- Same pattern for permissions
CREATE POLICY "permissions_select_authenticated" ON permissions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "permissions_insert_admin" ON permissions FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "permissions_update_admin" ON permissions FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "permissions_delete_admin" ON permissions FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- role_permissions — admin-only
CREATE POLICY "role_permissions_select_authenticated" ON role_permissions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "role_permissions_insert_admin" ON role_permissions FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "role_permissions_delete_admin" ON role_permissions FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- colaborador_roles — admin can manage, users see only their own
CREATE POLICY "colaborador_roles_select_own" ON colaborador_roles FOR SELECT TO authenticated USING (
    colaborador_id = current_colaborador_id()
    OR EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "colaborador_roles_insert_admin" ON colaborador_roles FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "colaborador_roles_delete_admin" ON colaborador_roles FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- 9.2  Organograma — admin CRUD, all authenticated can read active

CREATE POLICY "departamentos_select" ON departamentos FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "departamentos_insert_admin" ON departamentos FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "departamentos_update_admin" ON departamentos FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "departamentos_delete_admin" ON departamentos FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- Repeat for unidades, cargos, turnos (same pattern)
CREATE POLICY "unidades_select" ON unidades FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "unidades_insert_admin" ON unidades FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "unidades_update_admin" ON unidades FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "unidades_delete_admin" ON unidades FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

CREATE POLICY "cargos_select" ON cargos FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "cargos_insert_admin" ON cargos FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "cargos_update_admin" ON cargos FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "cargos_delete_admin" ON cargos FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

CREATE POLICY "turnos_select" ON turnos FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "turnos_insert_admin" ON turnos FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "turnos_update_admin" ON turnos FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "turnos_delete_admin" ON turnos FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- 9.3  Core — colaboradores: admins see all, collaborators see only themselves

CREATE POLICY "colaboradores_select" ON colaboradores FOR SELECT TO authenticated USING (
    id = current_colaborador_id()
    OR EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "colaboradores_insert_admin" ON colaboradores FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "colaboradores_update_self_or_admin" ON colaboradores FOR UPDATE TO authenticated USING (
    id = current_colaborador_id()
    OR EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "colaboradores_delete_admin" ON colaboradores FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- historico_lotacao: users see their own, admins see all
CREATE POLICY "historico_lotacao_select" ON historico_lotacao FOR SELECT TO authenticated USING (
    colaborador_id = current_colaborador_id()
    OR EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "historico_lotacao_insert_admin" ON historico_lotacao FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- 9.4  Workflow — admin CRUD, all authenticated read

CREATE POLICY "workflow_definitions_select" ON workflow_definitions FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "workflow_definitions_insert_admin" ON workflow_definitions FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "workflow_definitions_update_admin" ON workflow_definitions FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "workflow_definitions_delete_admin" ON workflow_definitions FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

CREATE POLICY "workflow_steps_select" ON workflow_steps FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "workflow_steps_insert_admin" ON workflow_steps FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "workflow_steps_update_admin" ON workflow_steps FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "workflow_steps_delete_admin" ON workflow_steps FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- 9.5  Domain — solicitacoes

CREATE POLICY "tipos_folga_select" ON tipos_folga FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "tipos_folga_insert_admin" ON tipos_folga FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "tipos_folga_update_admin" ON tipos_folga FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "tipos_folga_delete_admin" ON tipos_folga FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

CREATE POLICY "datas_bloqueadas_select" ON datas_bloqueadas FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "datas_bloqueadas_insert_admin" ON datas_bloqueadas FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "datas_bloqueadas_update_admin" ON datas_bloqueadas FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "datas_bloqueadas_delete_admin" ON datas_bloqueadas FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- Solicitacoes — users see own; admins see all; users insert own
CREATE POLICY "solicitacoes_select" ON solicitacoes FOR SELECT TO authenticated USING (
    colaborador_id = current_colaborador_id()
    OR EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "solicitacoes_insert_own" ON solicitacoes FOR INSERT TO authenticated WITH CHECK (
    colaborador_id = current_colaborador_id()
);
CREATE POLICY "solicitacoes_update_admin" ON solicitacoes FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "solicitacoes_delete_admin" ON solicitacoes FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- 9.6  Communications

CREATE POLICY "notificacoes_select" ON notificacoes FOR SELECT TO authenticated USING (
    colaborador_id = current_colaborador_id()
    OR EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "notificacoes_insert_system" ON notificacoes FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "notificacoes_update_own" ON notificacoes FOR UPDATE TO authenticated USING (
    colaborador_id = current_colaborador_id()
);

CREATE POLICY "comunicados_select" ON comunicados FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "comunicados_insert_admin" ON comunicados FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "comunicados_update_admin" ON comunicados FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "comunicados_delete_admin" ON comunicados FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

CREATE POLICY "comunicado_leitura_select_own" ON comunicado_leitura FOR SELECT TO authenticated USING (
    colaborador_id = current_colaborador_id()
);
CREATE POLICY "comunicado_leitura_insert_own" ON comunicado_leitura FOR INSERT TO authenticated WITH CHECK (
    colaborador_id = current_colaborador_id()
);

-- 9.7  Documents

CREATE POLICY "documentos_select" ON documentos FOR SELECT TO authenticated USING (
    colaborador_id = current_colaborador_id()
    OR EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "documentos_insert_admin" ON documentos FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "documentos_update_admin" ON documentos FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "documentos_delete_admin" ON documentos FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

CREATE POLICY "documento_versoes_select" ON documento_versoes FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM documentos d WHERE d.id = documento_id AND (d.colaborador_id = current_colaborador_id() OR EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')))
);
CREATE POLICY "documento_versoes_insert_admin" ON documento_versoes FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

CREATE POLICY "documento_assinaturas_select" ON documento_assinaturas FOR SELECT TO authenticated USING (
    colaborador_id = current_colaborador_id()
    OR EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "documento_assinaturas_insert_own" ON documento_assinaturas FOR INSERT TO authenticated WITH CHECK (
    colaborador_id = current_colaborador_id()
);

-- 9.8  Attachments

CREATE POLICY "anexos_select" ON anexos FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "anexos_insert_authenticated" ON anexos FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "anexos_delete_admin" ON anexos FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- 9.9  System — auditoria (admin read-only, insert via trigger)
CREATE POLICY "auditoria_select_admin" ON auditoria FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
-- Allow inserts from functions/triggers (service role) and admins
CREATE POLICY "auditoria_insert_authenticated" ON auditoria FOR INSERT TO authenticated WITH CHECK (TRUE);

-- configuracoes — admin CRUD, all authenticated read
CREATE POLICY "configuracoes_select" ON configuracoes FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "configuracoes_insert_admin" ON configuracoes FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "configuracoes_update_admin" ON configuracoes FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);
CREATE POLICY "configuracoes_delete_admin" ON configuracoes FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM colaborador_roles cr JOIN roles r ON r.id = cr.role_id WHERE cr.colaborador_id = current_colaborador_id() AND r.nome = 'admin')
);

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 10. COMMENTS
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- Tables
COMMENT ON TABLE roles IS 'System roles for RBAC (ex: admin, colaborador, supervisor)';
COMMENT ON TABLE permissions IS 'Individual permissions assignable to roles';
COMMENT ON TABLE role_permissions IS 'Many-to-many: role <-> permission';
COMMENT ON TABLE colaborador_roles IS 'Many-to-many: colaborador <-> role (RBAC)';
COMMENT ON TABLE departamentos IS 'Organizational departments (ex: Cuidado, Higienização)';
COMMENT ON TABLE unidades IS 'Physical/business units (ex: filiais, setores)';
COMMENT ON TABLE cargos IS 'Job positions / titles';
COMMENT ON TABLE turnos IS 'Work shifts linked to a department';
COMMENT ON TABLE colaboradores IS 'Core employee/ collaborator registry';
COMMENT ON TABLE historico_lotacao IS 'Historical record of department/shift assignments';
COMMENT ON TABLE workflow_definitions IS 'Workflow templates for different request types (stub for future engine)';
COMMENT ON TABLE workflow_steps IS 'Steps within a workflow definition (stub for future engine)';
COMMENT ON TABLE tipos_folga IS 'Leave types (ex: Folga Bônus, Banco de Horas, Compensação)';
COMMENT ON TABLE datas_bloqueadas IS 'Blackout dates where no leave requests are allowed';
COMMENT ON TABLE solicitacoes IS 'Leave requests made by collaborators';
COMMENT ON TABLE notificacoes IS 'In-app notifications for collaborators';
COMMENT ON TABLE comunicados IS 'Internal announcements / communications';
COMMENT ON TABLE comunicado_leitura IS 'Tracking which collaborators read which communications';
COMMENT ON TABLE documentos IS 'Document records (contracts, forms, etc.)';
COMMENT ON TABLE documento_versoes IS 'Versioned file uploads for a document';
COMMENT ON TABLE documento_assinaturas IS 'Electronic/digital signatures on documents';
COMMENT ON TABLE anexos IS 'Polymorphic file attachments for any entity';
COMMENT ON TABLE auditoria IS 'Audit log for all critical system operations';
COMMENT ON TABLE configuracoes IS 'System configuration key-value store';

-- Functions
COMMENT ON FUNCTION current_colaborador_id IS 'Returns the colaboradores.id for the currently authenticated Supabase user';
COMMENT ON FUNCTION set_audit_fields IS 'Trigger function that auto-sets created_at, updated_at, created_by, updated_by';

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 11. SEEDS (immutable system data only)
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- Roles
INSERT INTO roles (nome, descricao) VALUES
    ('admin', 'Administrador do sistema — acesso total'),
    ('colaborador', 'Colaborador padrão — acesso restrito ao próprio perfil')
ON CONFLICT (nome) WHERE is_active = TRUE DO NOTHING;

-- Permissions
INSERT INTO permissions (nome, descricao, module, grupo) VALUES
    ('colaborador.listar',  'Listar todos os colaboradores',     'colaboradores', 'admin'),
    ('colaborador.criar',   'Criar novo colaborador',            'colaboradores', 'admin'),
    ('colaborador.editar',  'Editar colaborador existente',      'colaboradores', 'admin'),
    ('colaborador.excluir', 'Excluir colaborador',               'colaboradores', 'admin'),
    ('solicitacao.listar',  'Listar todas as solicitações',      'solicitacoes',  'admin'),
    ('solicitacao.aprovar', 'Aprovar solicitação de folga',      'solicitacoes',  'admin'),
    ('solicitacao.reprovar','Reprovar solicitação de folga',     'solicitacoes',  'admin'),
    ('solicitacao.cancelar','Cancelar solicitação de folga',     'solicitacoes',  'admin'),
    ('auditoria.consultar', 'Consultar registros de auditoria',  'auditoria',     'admin'),
    ('relatorio.emitir',    'Emitir relatórios do sistema',      'relatorios',    'admin'),
    ('configuracao.editar', 'Editar configurações do sistema',   'configuracoes', 'admin'),
    ('solicitacao.criar',   'Criar solicitação de folga',        'solicitacoes',  'colaborador'),
    ('solicitacao.visualizar','Visualizar próprias solicitações','solicitacoes',  'colaborador'),
    ('notificacao.visualizar','Visualizar próprias notificações','notificacoes',  'colaborador')
ON CONFLICT (nome) WHERE is_active = TRUE DO NOTHING;

-- Assign all permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'admin'
ON CONFLICT DO NOTHING;

-- Assign collaborator-specific permissions to colaborador role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'colaborador'
  AND p.nome IN ('solicitacao.criar', 'solicitacao.visualizar', 'notificacao.visualizar')
ON CONFLICT DO NOTHING;

-- Workflow definitions (stub for MVP — leaves follow simple admin approval)
INSERT INTO workflow_definitions (nome, descricao, entidade_tipo) VALUES
    ('fluxo_folga_padrao', 'Fluxo padrão de aprovação de folga: Pendente → Aprovado/Reprovado', 'solicitacao')
ON CONFLICT DO NOTHING;

-- Workflow steps
INSERT INTO workflow_steps (workflow_definition_id, nome, ordem, is_terminal)
SELECT wd.id, 'pendente', 1, FALSE
FROM workflow_definitions wd
WHERE wd.nome = 'fluxo_folga_padrao'
ON CONFLICT (workflow_definition_id, ordem) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO workflow_steps (workflow_definition_id, nome, ordem, is_terminal)
SELECT wd.id, 'aprovada', 2, TRUE
FROM workflow_definitions wd
WHERE wd.nome = 'fluxo_folga_padrao'
ON CONFLICT (workflow_definition_id, ordem) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO workflow_steps (workflow_definition_id, nome, ordem, is_terminal)
SELECT wd.id, 'reprovada', 3, TRUE
FROM workflow_definitions wd
WHERE wd.nome = 'fluxo_folga_padrao'
ON CONFLICT (workflow_definition_id, ordem) WHERE deleted_at IS NULL DO NOTHING;

-- Departamentos (from RN-001 / RN-002)
INSERT INTO departamentos (nome, descricao) VALUES
    ('Cuidado', 'Equipe de cuidado'),
    ('Higienização', 'Equipe de higienização')
ON CONFLICT (nome) WHERE deleted_at IS NULL DO NOTHING;

-- Turnos (from RN-002)
INSERT INTO turnos (departamento_id, nome, descricao)
SELECT d.id, 'Dia', 'Turno diurno'
FROM departamentos d
WHERE d.nome IN ('Cuidado', 'Higienização')
ON CONFLICT (departamento_id, nome) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO turnos (departamento_id, nome, descricao)
SELECT d.id, 'Noite', 'Turno noturno'
FROM departamentos d
WHERE d.nome = 'Cuidado'
ON CONFLICT (departamento_id, nome) WHERE deleted_at IS NULL DO NOTHING;

-- Default system configuration (RF-057, RF-058)
INSERT INTO configuracoes (chave, valor, tipo, descricao) VALUES
    ('fechamento_dia', '25', 'integer', 'Dia de fechamento mensal para solicitações (RN-012)'),
    ('antecedencia_meses', '12', 'integer', 'Antecedência máxima em meses para solicitar folga (RN-013)'),
    ('solicitacoes_simultaneas_max', '3', 'integer', 'Quantidade máxima de solicitações simultâneas pendentes/ativas por colaborador')
ON CONFLICT (chave) DO NOTHING;

-- Roles assignment for the first admin user must be done manually after the
-- first colaborador record is created (chicken-and-egg with auth.users).

-- ============================================================================
-- END OF MIGRATION 0001
-- ============================================================================
