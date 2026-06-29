-- ============================================================================
-- Portal do Colaborador — Migration 0012: Event Engine
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Create event_log table
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  origin TEXT NOT NULL,
  payload JSONB DEFAULT NULL,
  colaborador_id UUID REFERENCES colaboradores(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'processed',
  execution_ms INTEGER DEFAULT NULL,
  error_message TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 2. Indexes for performance
-- --------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_event_log_event_type ON event_log (event_type);
CREATE INDEX IF NOT EXISTS idx_event_log_created_at ON event_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_log_status ON event_log (status);
CREATE INDEX IF NOT EXISTS idx_event_log_colaborador ON event_log (colaborador_id);

-- --------------------------------------------------------------------------
-- 3. RLS policies
-- --------------------------------------------------------------------------
ALTER TABLE event_log ENABLE ROW LEVEL SECURITY;

-- Admins can see all events
CREATE POLICY event_log_admin_all ON event_log
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM colaborador_roles cr
      JOIN roles r ON r.id = cr.role_id
      WHERE cr.colaborador_id = current_colaborador_id()
        AND r.nome = 'admin'
    )
  );

-- All authenticated users can insert events (for the dispatcher)
CREATE POLICY event_log_insert_auth ON event_log
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- --------------------------------------------------------------------------
-- 4. Permission for event dashboard
-- --------------------------------------------------------------------------
INSERT INTO permissions (nome, descricao, module, grupo) VALUES
  ('eventos.read', 'Visualizar painel de eventos', 'eventos', 'admin')
ON CONFLICT (nome) WHERE is_active = TRUE DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nome = 'admin'
  AND p.nome = 'eventos.read'
ON CONFLICT DO NOTHING;
