-- Enable Realtime for the 'messages' table
-- This allows clients to subscribe to chat messages using supabase.channel()
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.messages;
COMMIT;
