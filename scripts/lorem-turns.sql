-- The conversation log behind app/api/lorem/logTurn.ts.
-- Run once, in the Supabase SQL editor of whichever project holds the keys.
--
-- RLS is enabled with NO policies on purpose: that makes the table invisible
-- to the anon key entirely, so only the service role key — which lives
-- server-side in Vercel and .env.local, never NEXT_PUBLIC — can read or
-- write. Do not add policies unless something client-side ever needs this,
-- and nothing should.

create table if not exists lorem_turns (
  id         bigint generated always as identity primary key,
  session_id text        not null,           -- random per page load; groups turns, identifies nobody
  mode       text,                           -- 'voice' | 'text'
  message    text        not null,           -- what the visitor said (capped at 500 chars upstream)
  say        text        not null,           -- what Lorem spoke back
  show       jsonb,                          -- the visual blocks, by type and content
  chips      jsonb,                          -- the follow-ups offered
  model      text,                           -- which brain answered
  ms         integer,                        -- whole-turn latency
  error      text,                           -- set only on failure turns: 'upstream' | 'no_tool' | 'echo' | 'scrubbed' | 'self_repeat'
  created_at timestamptz default now()
);

-- Migration for tables created before the error column existed (2026-08-25).
-- Safe to re-run; a no-op once applied.
alter table lorem_turns add column if not exists error text;

create index if not exists lorem_turns_session on lorem_turns (session_id, created_at);
create index if not exists lorem_turns_created on lorem_turns (created_at);

alter table lorem_turns enable row level security;
