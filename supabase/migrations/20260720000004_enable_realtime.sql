-- Activation du Realtime Supabase pour les notifications, les commandes et le chat
-- Garantit une réception instantanée (< 100ms via WebSockets)

BEGIN;
  -- 1. Configuration de l'identité de réplication pour diffuser l'intégralité des données
  ALTER TABLE public.notifications REPLICA IDENTITY FULL;
  ALTER TABLE public.orders REPLICA IDENTITY FULL;
  ALTER TABLE public.messages REPLICA IDENTITY FULL;

  -- 2. Création ou mise à jour de la publication supabase_realtime
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      CREATE PUBLICATION supabase_realtime;
    END IF;
  END $$;

  -- 3. Ajout sécurisé des tables dans la publication Realtime
  DO $$
  BEGIN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    EXCEPTION WHEN duplicate_object THEN
      -- Déjà présent
    END;

    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    EXCEPTION WHEN duplicate_object THEN
      -- Déjà présent
    END;

    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    EXCEPTION WHEN duplicate_object THEN
      -- Déjà présent
    END;
  END $$;
COMMIT;
