-- Visitor contact details volunteered so Dinesh can follow up.
-- Behind app/api/lorem/logContact.ts, which is OFF unless LOREM_CONTACT_CAPTURE=on.
-- Run once in the Lorem-portfolio project's SQL editor (same project as lorem_turns).
--
-- RLS on with no policies, same as lorem_turns: service key only. This table
-- holds real people's email addresses — it must never be readable by anon.

create table if not exists lorem_contacts (
  id         bigint generated always as identity primary key,
  session_id text not null,            -- links back to the conversation in lorem_turns
  name       text,                     -- the first name they gave Lorem, if any
  email      text,
  linkedin   text,
  note       text,                     -- why they want to connect, in their words
  created_at timestamptz default now()
);

create index if not exists lorem_contacts_created on lorem_contacts (created_at);

alter table lorem_contacts enable row level security;
