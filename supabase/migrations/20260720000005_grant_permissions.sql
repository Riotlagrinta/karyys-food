-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Categories: lecture pour tous
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;

-- Menu Items: lecture pour tous
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;

-- Profiles: lecture pour tous, écriture pour authenticated
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Orders: authenticated peut créer/lire
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- Order Items: authenticated peut créer/lire
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

-- Deliveries: authenticated peut lire/modifier
GRANT SELECT, UPDATE ON public.deliveries TO authenticated;
GRANT ALL ON public.deliveries TO service_role;

-- Messages: authenticated peut créer/lire
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

-- Notifications: authenticated peut lire/modifier
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT INSERT ON public.notifications TO service_role;
GRANT ALL ON public.notifications TO service_role;
