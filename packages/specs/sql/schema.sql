-- Manus Engine Database Schema
-- SQLite tables for task management, sessions, and artifacts

-- Tasks table for gamified roadmap
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',  -- todo, doing, done
  type TEXT NOT NULL,                   -- quest, bug, feature
  points INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  description TEXT,
  assignee TEXT,
  priority TEXT DEFAULT 'medium'        -- low, medium, high, critical
);

-- Sessions table for council and playtest tracking
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,                   -- council, playtest, review
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  ended_at TEXT,
  summary TEXT,
  status TEXT DEFAULT 'active',         -- active, completed, failed
  metadata TEXT                         -- JSON string for additional data
);

-- Artifacts table for generated outputs
CREATE TABLE artifacts (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  kind TEXT NOT NULL,                   -- patch, test, workflow, adr, synthesis
  ref TEXT NOT NULL,                    -- file path or reference
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  metadata TEXT,                        -- JSON string for additional data
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Evidence table for validation results
CREATE TABLE evidence (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  provider TEXT NOT NULL,               -- luau-linter, unit-test-runner, perfprobe
  status TEXT NOT NULL,                 -- pass, fail, warn, error
  result TEXT,                          -- JSON string for detailed results
  execution_time_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Agent messages table for council communication
CREATE TABLE agent_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  round INTEGER NOT NULL,
  message_type TEXT NOT NULL,           -- proposal, critique, evidence
  content TEXT NOT NULL,                -- JSON string for message content
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Telemetry events table for PostHog integration
CREATE TABLE telemetry_events (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT,
  properties TEXT,                      -- JSON string for event properties
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_sessions_kind ON sessions(kind);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_artifacts_session ON artifacts(session_id);
CREATE INDEX idx_evidence_session ON evidence(session_id);
CREATE INDEX idx_agent_messages_session ON agent_messages(session_id);
CREATE INDEX idx_telemetry_events_name ON telemetry_events(event_name);
