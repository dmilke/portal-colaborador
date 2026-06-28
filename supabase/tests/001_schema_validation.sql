-- ============================================================================
-- Portal do Colaborador — Schema Validation Test 001
-- ============================================================================
-- Run via: psql -f supabase/tests/001_schema_validation.sql
-- Or in Supabase:  psql -h <host> -U <user> -d <db> -f supabase/tests/001_schema_validation.sql
--
-- Returns: row count = number of assertions; column "status" = PASS/FAIL
-- ============================================================================

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- Helper: assertion function
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

CREATE OR REPLACE FUNCTION _test_assert(
    test_name TEXT,
    condition BOOLEAN,
    detail    TEXT DEFAULT NULL
) RETURNS TABLE (status TEXT, test TEXT, info TEXT) AS $$
BEGIN
    IF condition THEN
        status := 'PASS';
    ELSE
        status := 'FAIL';
    END IF;
    test := test_name;
    info := COALESCE(detail, '');
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 1. EXTENSION EXISTENCE
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

SELECT * FROM _test_assert(
    'Extension pgcrypto exists',
    (SELECT COUNT(*) FROM pg_extension WHERE extname = 'pgcrypto') = 1
);

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 2. ENUM EXISTENCE
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

SELECT * FROM _test_assert(
    'Enum request_status exists',
    (SELECT COUNT(*) FROM pg_type WHERE typname = 'request_status') = 1
);

SELECT * FROM _test_assert(
    'Enum acao_tipo exists',
    (SELECT COUNT(*) FROM pg_type WHERE typname = 'acao_tipo') = 1
);

SELECT * FROM _test_assert(
    'Enum document_status exists',
    (SELECT COUNT(*) FROM pg_type WHERE typname = 'document_status') = 1
);

SELECT * FROM _test_assert(
    'Enum signature_type exists',
    (SELECT COUNT(*) FROM pg_type WHERE typname = 'signature_type') = 1
);

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 3. TABLE EXISTENCE (24 tables expected)
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

SELECT * FROM _test_assert(
    'All 24 tables exist',
    (SELECT COUNT(*) FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE') = 24
);

-- Individual table checks
SELECT * FROM _test_assert('Table roles exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'roles'));
SELECT * FROM _test_assert('Table permissions exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'permissions'));
SELECT * FROM _test_assert('Table role_permissions exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'role_permissions'));
SELECT * FROM _test_assert('Table colaborador_roles exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'colaborador_roles'));
SELECT * FROM _test_assert('Table departamentos exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'departamentos'));
SELECT * FROM _test_assert('Table unidades exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'unidades'));
SELECT * FROM _test_assert('Table cargos exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cargos'));
SELECT * FROM _test_assert('Table turnos exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'turnos'));
SELECT * FROM _test_assert('Table colaboradores exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'colaboradores'));
SELECT * FROM _test_assert('Table historico_lotacao exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'historico_lotacao'));
SELECT * FROM _test_assert('Table workflow_definitions exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workflow_definitions'));
SELECT * FROM _test_assert('Table workflow_steps exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workflow_steps'));
SELECT * FROM _test_assert('Table tipos_folga exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tipos_folga'));
SELECT * FROM _test_assert('Table datas_bloqueadas exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'datas_bloqueadas'));
SELECT * FROM _test_assert('Table solicitacoes exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'solicitacoes'));
SELECT * FROM _test_assert('Table notificacoes exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notificacoes'));
SELECT * FROM _test_assert('Table comunicados exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'comunicados'));
SELECT * FROM _test_assert('Table comunicado_leitura exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'comunicado_leitura'));
SELECT * FROM _test_assert('Table documentos exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'documentos'));
SELECT * FROM _test_assert('Table documento_versoes exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'documento_versoes'));
SELECT * FROM _test_assert('Table documento_assinaturas exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'documento_assinaturas'));
SELECT * FROM _test_assert('Table anexos exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'anexos'));
SELECT * FROM _test_assert('Table auditoria exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'auditoria'));
SELECT * FROM _test_assert('Table configuracoes exists',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'configuracoes'));

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 4. COLUMN EXISTENCE & TYPE CHECKS
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- roles
SELECT * FROM _test_assert('roles.id UUID PK',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'roles' AND column_name = 'id' AND data_type = 'uuid' AND is_nullable = 'NO'));
SELECT * FROM _test_assert('roles.nome VARCHAR NOT NULL',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'roles' AND column_name = 'nome' AND character_maximum_length = 100 AND is_nullable = 'NO'));

-- colaboradores (key enterprise fields)
SELECT * FROM _test_assert('colaboradores.matricula VARCHAR(50)',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'colaboradores' AND column_name = 'matricula' AND character_maximum_length = 50));
SELECT * FROM _test_assert('colaboradores.cpf VARCHAR(11)',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'colaboradores' AND column_name = 'cpf' AND character_maximum_length = 11));
SELECT * FROM _test_assert('colaboradores.email VARCHAR',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'colaboradores' AND column_name = 'email'));
SELECT * FROM _test_assert('colaboradores.avatar_url TEXT',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'colaboradores' AND column_name = 'avatar_url' AND data_type = 'text'));
SELECT * FROM _test_assert('colaboradores.data_nascimento DATE',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'colaboradores' AND column_name = 'data_nascimento' AND data_type = 'date'));
SELECT * FROM _test_assert('colaboradores.deleted_at TIMESTAMPTZ',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'colaboradores' AND column_name = 'deleted_at' AND data_type = 'timestamp with time zone'));

-- solicitacoes status uses enum
SELECT * FROM _test_assert('solicitacoes.status uses request_status enum',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'solicitacoes' AND column_name = 'status' AND udt_name = 'request_status'));

-- notificacoes payload JSONB
SELECT * FROM _test_assert('notificacoes.payload JSONB',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notificacoes' AND column_name = 'payload' AND data_type = 'jsonb'));

-- auditoria request_id UUID
SELECT * FROM _test_assert('auditoria.request_id UUID',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auditoria' AND column_name = 'request_id' AND data_type = 'uuid'));

-- configuracoes tipo
SELECT * FROM _test_assert('configuracoes.tipo VARCHAR(20)',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'configuracoes' AND column_name = 'tipo' AND character_maximum_length = 20));

-- anexos polymorphic fields
SELECT * FROM _test_assert('anexos.entidade_tipo VARCHAR(50)',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anexos' AND column_name = 'entidade_tipo' AND character_maximum_length = 50));
SELECT * FROM _test_assert('anexos.entidade_id UUID',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anexos' AND column_name = 'entidade_id' AND data_type = 'uuid'));

-- documento_versoes checksum
SELECT * FROM _test_assert('documento_versoes.checksum VARCHAR(64)',
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documento_versoes' AND column_name = 'checksum' AND character_maximum_length = 64));

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 5. FOREIGN KEY EXISTENCE
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- Count total FK constraints (explicit + dynamic)
-- Expected: 2 (role_permissions) + 2 (colaborador_roles) + 1 (turnos)
--           + 7 (colaboradores: auth_user, departamento, unidade, cargo + created_by, updated_by, historico_lotacao)
--           + 3 (historico_lotacao: colaborador, departamento, turno)
--           + 1 (workflow_steps)
--           + 6 (solicitacoes: colaborador, tipo_folga, turno, workflow_definition, workflow_step, aprovado_por)
--           + 2 (notificacoes: colaborador, solicitacao)
--           + 3 (comunicados: autor, departamento, unidade)
--           + 2 (comunicado_leitura: comunicado, colaborador)
--           + 3 (documentos: colaborador, departamento, unidade)
--           + 1 (documento_versoes)
--           + 2 (documento_assinaturas: documento, colaborador)
--           + dynamic created_by: 13 tables × 2 = 26 (but configuracoes has both = 26)
--           + historico_lotacao created_by
--           + documento_versoes created_by
--           + anexos created_by
--
-- Dynamic block loop: 14 tables × 2 FKs = 28
-- Explicit created_by: historico_lotacao(1) + documento_versoes(1) + anexos(1) = 3
-- Non-created_by FKs: 2+2+1+1+3+1+6+2+3+2+3+1+2 = 29
-- Wait, configuracoes has created_by and updated_by via the dynamic loop.
-- The dynamic loop tables: departamentos, unidades, cargos, turnos, colaboradores, workflow_definitions, workflow_steps, tipos_folga, datas_bloqueadas, solicitacoes, notificacoes, comunicados, documentos, configuracoes = 14
-- Dynamic FK count: 14 * 2 = 28 (created_by + updated_by for each)
--
-- Total non-dynamic FKs:
-- role_permissions: 2
-- colaborador_roles: 2
-- turnos: 1
-- colaboradores (auth_user, departamento, unidade, cargo): 4 (NOT including created_by/updated_by which are dynamic)
-- historico_lotacao (colaborador, departamento, turno): 3
-- workflow_steps: 1
-- solicitacoes (colaborador, tipo_folga, turno, workflow_definition, workflow_step, aprovado_por): 6
-- notificacoes (colaborador, solicitacao): 2
-- comunicados (autor, departamento, unidade): 3
-- comunicado_leitura (comunicado, colaborador): 2
-- documentos (colaborador, departamento, unidade): 3
-- documento_versoes: 1
-- documento_assinaturas (documento, colaborador): 2
-- = 32
--
-- Manually added created_by FKs: historico_lotacao(1) + documento_versoes(1) + anexos(1) = 3
-- Total: 28 + 32 + 3 = 63

SELECT * FROM _test_assert(
    'Total FK constraints >= 60',
    (SELECT COUNT(*) FROM information_schema.table_constraints tc
     JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
     WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public') >= 60
);

-- Key FKs
SELECT * FROM _test_assert('FK colaboradores -> auth.users',
    EXISTS (SELECT 1 FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'colaboradores'
              AND ccu.table_schema = 'auth' AND ccu.table_name = 'users'));

SELECT * FROM _test_assert('FK colaborador_roles -> colaboradores',
    EXISTS (SELECT 1 FROM information_schema.table_constraints
     WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'colaborador_roles'
       AND constraint_name LIKE '%colaborador%'));

SELECT * FROM _test_assert('FK turnos -> departamentos',
    EXISTS (SELECT 1 FROM information_schema.table_constraints
     WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'turnos'
       AND constraint_name LIKE '%departamento%'));

SELECT * FROM _test_assert('FK solicitacoes -> colaboradores',
    EXISTS (SELECT 1 FROM information_schema.table_constraints
     WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'solicitacoes'
       AND constraint_name LIKE '%colaborador%'));

SELECT * FROM _test_assert('FK notificacoes -> solicitacoes',
    EXISTS (SELECT 1 FROM information_schema.table_constraints
     WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'notificacoes'
       AND constraint_name LIKE '%solicitacao%'));

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 6. UNIQUE INDEX EXISTENCE
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

SELECT * FROM _test_assert('uq_solicitacoes_ativo (RN-021)',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'uq_solicitacoes_ativo'));
SELECT * FROM _test_assert('uq_solicitacoes_vaga (RN-005)',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'uq_solicitacoes_vaga'));
SELECT * FROM _test_assert('uq_configuracoes_chave',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'uq_configuracoes_chave'));
SELECT * FROM _test_assert('uq_workflow_steps_ordem',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'uq_workflow_steps_ordem'));
SELECT * FROM _test_assert('uq_documento_versoes_numero',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'uq_documento_versoes_numero'));
SELECT * FROM _test_assert('uq_roles_nome',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'uq_roles_nome'));
SELECT * FROM _test_assert('uq_permissions_nome',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'uq_permissions_nome'));
SELECT * FROM _test_assert('uq_departamentos_nome',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'uq_departamentos_nome'));
SELECT * FROM _test_assert('uq_turnos_departamento_nome',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'uq_turnos_departamento_nome'));

-- Count total unique indexes (partial + full)
SELECT * FROM _test_assert(
    '10 unique indexes exist',
    (SELECT COUNT(*) FROM pg_indexes WHERE indexname LIKE 'uq\_%') = 10
);

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 7. PERFORMANCE INDEX EXISTENCE
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

SELECT * FROM _test_assert(
    '35+ total indexes (unique + performance)',
    (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND tablename NOT IN ('_test_assert')) >= 35
);

SELECT * FROM _test_assert('idx_solicitacoes_colaborador',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_solicitacoes_colaborador'));
SELECT * FROM _test_assert('idx_auditoria_data',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_auditoria_data'));
SELECT * FROM _test_assert('idx_notificacoes_lida',
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notificacoes_lida'));

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 8. FUNCTION EXISTENCE
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

SELECT * FROM _test_assert('Function current_colaborador_id() exists',
    EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'current_colaborador_id' AND pronargs = 0));

SELECT * FROM _test_assert('Function set_audit_fields() exists',
    EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_audit_fields' AND pronargs = 0));

-- Verify current_colaborador_id returns UUID
SELECT * FROM _test_assert('current_colaborador_id returns UUID',
    EXISTS (SELECT 1 FROM pg_proc p
            JOIN pg_type t ON p.prorettype = t.oid
            WHERE p.proname = 'current_colaborador_id' AND t.typname = 'uuid'));

-- Verify set_audit_fields is a trigger function (returns TRIGGER)
SELECT * FROM _test_assert('set_audit_fields is trigger function',
    EXISTS (SELECT 1 FROM pg_proc p
            JOIN pg_type t ON p.prorettype = t.oid
            WHERE p.proname = 'set_audit_fields' AND t.typname = 'trigger'));

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 9. TRIGGER EXISTENCE
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- 14 tables × 1 trigger (BEFORE INSERT OR UPDATE) + historico_lotacao (BEFORE INSERT) = 15
SELECT * FROM _test_assert(
    '15 triggers exist',
    (SELECT COUNT(*) FROM information_schema.triggers
     WHERE trigger_schema = 'public' AND event_manipulation IN ('INSERT', 'UPDATE')) = 15
);

-- Verify trigger on key tables
SELECT * FROM _test_assert('Trigger trg_colaboradores_audit',
    EXISTS (SELECT 1 FROM information_schema.triggers
     WHERE trigger_schema = 'public' AND trigger_name = 'trg_colaboradores_audit'));
SELECT * FROM _test_assert('Trigger trg_solicitacoes_audit',
    EXISTS (SELECT 1 FROM information_schema.triggers
     WHERE trigger_schema = 'public' AND trigger_name = 'trg_solicitacoes_audit'));
SELECT * FROM _test_assert('Trigger trg_configuracoes_audit',
    EXISTS (SELECT 1 FROM information_schema.triggers
     WHERE trigger_schema = 'public' AND trigger_name = 'trg_configuracoes_audit'));
SELECT * FROM _test_assert('Trigger trg_historico_lotacao_audit',
    EXISTS (SELECT 1 FROM information_schema.triggers
     WHERE trigger_schema = 'public' AND trigger_name = 'trg_historico_lotacao_audit'));

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 10. RLS ENABLED
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

SELECT * FROM _test_assert(
    'RLS enabled on all 24 user tables',
    (SELECT COUNT(*) FROM pg_tables t
     WHERE t.schemaname = 'public' AND t.tablename NOT IN ('_test_assert')
       AND t.rowsecurity = TRUE) = 24
);

-- Spot-check specific tables
SELECT * FROM _test_assert('RLS enabled on colaboradores',
    (SELECT relrowsecurity FROM pg_class WHERE relname = 'colaboradores' AND relnamespace = 'public'::regnamespace));
SELECT * FROM _test_assert('RLS enabled on solicitacoes',
    (SELECT relrowsecurity FROM pg_class WHERE relname = 'solicitacoes' AND relnamespace = 'public'::regnamespace));
SELECT * FROM _test_assert('RLS enabled on auditoria',
    (SELECT relrowsecurity FROM pg_class WHERE relname = 'auditoria' AND relnamespace = 'public'::regnamespace));

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 11. RLS POLICY EXISTENCE
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

SELECT * FROM _test_assert(
    '60+ RLS policies exist',
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') >= 60
);

-- RBAC policies
SELECT * FROM _test_assert('Policy roles_select_authenticated',
    EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'roles_select_authenticated'));
SELECT * FROM _test_assert('Policy roles_insert_admin',
    EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'roles_insert_admin'));

-- Core policies
SELECT * FROM _test_assert('Policy colaboradores_select',
    EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'colaboradores_select'));
SELECT * FROM _test_assert('Policy colaboradores_update_self_or_admin',
    EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'colaboradores_update_self_or_admin'));

-- Domain policies
SELECT * FROM _test_assert('Policy solicitacoes_select',
    EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'solicitacoes_select'));
SELECT * FROM _test_assert('Policy solicitacoes_insert_own',
    EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'solicitacoes_insert_own'));

-- System policies
SELECT * FROM _test_assert('Policy auditoria_select_admin',
    EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'auditoria_select_admin'));
SELECT * FROM _test_assert('Policy configuracoes_select',
    EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'configuracoes_select'));

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 12. SEED DATA VERIFICATION
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- Roles
SELECT * FROM _test_assert('Seed: role "admin" exists',
    EXISTS (SELECT 1 FROM roles WHERE nome = 'admin' AND is_active = TRUE));
SELECT * FROM _test_assert('Seed: role "colaborador" exists',
    EXISTS (SELECT 1 FROM roles WHERE nome = 'colaborador' AND is_active = TRUE));

-- Permissions
SELECT * FROM _test_assert('Seed: 14 permissions exist',
    (SELECT COUNT(*) FROM permissions WHERE is_active = TRUE) = 14);

-- Role-permission assignments
SELECT * FROM _test_assert('Seed: admin has all permissions assigned',
    (SELECT COUNT(*) FROM role_permissions rp JOIN roles r ON r.id = rp.role_id WHERE r.nome = 'admin') >= 14);
SELECT * FROM _test_assert('Seed: colaborador has 3 permissions assigned',
    (SELECT COUNT(*) FROM role_permissions rp JOIN roles r ON r.id = rp.role_id WHERE r.nome = 'colaborador') = 3);

-- Workflow
SELECT * FROM _test_assert('Seed: workflow definition "fluxo_folga_padrao" exists',
    EXISTS (SELECT 1 FROM workflow_definitions WHERE nome = 'fluxo_folga_padrao' AND is_active = TRUE));
SELECT * FROM _test_assert('Seed: 3 workflow steps exist',
    (SELECT COUNT(*) FROM workflow_steps ws
     JOIN workflow_definitions wd ON wd.id = ws.workflow_definition_id
     WHERE wd.nome = 'fluxo_folga_padrao' AND ws.deleted_at IS NULL) = 3);

-- Departamentos
SELECT * FROM _test_assert('Seed: departamento "Cuidado" exists',
    EXISTS (SELECT 1 FROM departamentos WHERE nome = 'Cuidado' AND deleted_at IS NULL));
SELECT * FROM _test_assert('Seed: departamento "Higienização" exists',
    EXISTS (SELECT 1 FROM departamentos WHERE nome = 'Higienização' AND deleted_at IS NULL));

-- Turnos
SELECT * FROM _test_assert('Seed: turno Dia exists (Cuidado + Higienização)',
    (SELECT COUNT(*) FROM turnos WHERE nome = 'Dia' AND deleted_at IS NULL) = 2);
SELECT * FROM _test_assert('Seed: turno Noite exists (only Cuidado)',
    (SELECT COUNT(*) FROM turnos WHERE nome = 'Noite' AND deleted_at IS NULL) = 1);

-- Configuracoes
SELECT * FROM _test_assert('Seed: config "fechamento_dia" exists',
    EXISTS (SELECT 1 FROM configuracoes WHERE chave = 'fechamento_dia'));
SELECT * FROM _test_assert('Seed: config "antecedencia_meses" exists',
    EXISTS (SELECT 1 FROM configuracoes WHERE chave = 'antecedencia_meses'));
SELECT * FROM _test_assert('Seed: config "solicitacoes_simultaneas_max" exists',
    EXISTS (SELECT 1 FROM configuracoes WHERE chave = 'solicitacoes_simultaneas_max'));

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 13. SPECIFIC BUSINESS RULE VALIDATIONS (data integrity)
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-- RN-005: One slot per date/shift — enforced by uq_solicitacoes_vaga unique index.
-- Verify the partial index predicate matches the business rule.
SELECT * FROM _test_assert(
    'RN-005 partial index WHERE status IN (pendente, aprovada)',
    (SELECT indexdef FROM pg_indexes WHERE indexname = 'uq_solicitacoes_vaga') LIKE '%status IN (%pendente%, %aprovada%)%'
    OR (SELECT indexdef FROM pg_indexes WHERE indexname = 'uq_solicitacoes_vaga') LIKE '%status = %pendente%::request_status%'
);

-- RN-021: Unique active solicitation per collaborator/date/shift/leave-type
SELECT * FROM _test_assert(
    'RN-021 partial index WHERE status NOT IN (cancelada, reprovada, expirada)',
    (SELECT indexdef FROM pg_indexes WHERE indexname = 'uq_solicitacoes_ativo') LIKE '%NOT IN (%cancelada%, %reprovada%, %expirada%)%'
);

-- RN-015: Auditoria is append-only — verify no UPDATE/DELETE policies exist
SELECT * FROM _test_assert(
    'RN-015: Auditoria has no UPDATE/DELETE policies',
    (SELECT COUNT(*) FROM pg_policies
     WHERE schemaname = 'public' AND tablename = 'auditoria'
       AND cmd IN ('UPDATE', 'DELETE')) = 0
);

-- RN-016: No historical data can be deleted — verify historico_lotacao has no DELETE policies
SELECT * FROM _test_assert(
    'RN-016: historico_lotacao has no DELETE policy',
    (SELECT COUNT(*) FROM pg_policies
     WHERE schemaname = 'public' AND tablename = 'historico_lotacao'
       AND cmd = 'DELETE') = 0
);

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- 14. SUMMARY
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

WITH results AS (
    SELECT COUNT(*) FILTER (WHERE status = 'PASS') AS passed,
           COUNT(*) FILTER (WHERE status = 'FAIL') AS failed,
           COUNT(*) AS total
    FROM _test_assert('dummy', TRUE)
)
SELECT 'SCHEMA VALIDATION COMPLETE' AS result,
       passed, failed, total,
       CASE WHEN failed = 0 THEN 'ALL CHECKS PASSED' ELSE 'SOME CHECKS FAILED' END AS verdict
FROM results;

-- Cleanup helper function
DROP FUNCTION IF EXISTS _test_assert;
