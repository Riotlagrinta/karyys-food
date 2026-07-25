-- =============================================
-- SEED DATA : Karyy's Food
-- =============================================

-- 1. Catégories
INSERT INTO public.categories (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Pâtisseries', 'Nos délices sucrés et gâteaux sur commande'),
('22222222-2222-2222-2222-222222222222', 'Restauration Africaine', 'Plats traditionnels savoureux'),
('33333333-3333-3333-3333-333333333333', 'Restauration Occidentale', 'Burgers, pizzas et classiques internationaux'),
('55555555-5555-5555-5555-555555555555', 'Boissons', 'Jus naturels, cocktails et boissons rafraîchissantes');

-- 2. Plats du Menu
INSERT INTO public.menu_items (id, category_id, name, description, price, image_url, is_available) VALUES

-- Pâtisseries
('44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', 'Forêt Noire', 'Gâteau au chocolat, cerises et crème chantilly', 15000, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111', 'Croissants (x5)', 'Pur beurre, faits maison chaque matin', 3000, 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444447', '11111111-1111-1111-1111-111111111111', 'Fondant au Chocolat', 'Cœur coulant au chocolat noir 70%', 5000, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444448', '11111111-1111-1111-1111-111111111111', 'Tarte aux Fruits', 'Fruits frais de saison sur crème pâtissière', 8000, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop', true),

-- Restauration Africaine
('44444444-4444-4444-4444-444444444443', '22222222-2222-2222-2222-222222222222', 'Poulet DG', 'Mélange de poulet, frites de plantain et légumes sautés', 8000, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Ayimolou', 'Riz et haricots avec sauce tomate pimentée togolaise', 2500, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444449', '22222222-2222-2222-2222-222222222222', 'Fufu & Sauce Arachide', 'Pâte de manioc avec sauce arachide au poulet fumé', 3500, 'https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444450', '22222222-2222-2222-2222-222222222222', 'Riz Jollof', 'Riz parfumé aux tomates, épices et poulet grillé', 4000, 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444451', '22222222-2222-2222-2222-222222222222', 'Grillades de Brochettes', 'Brochettes de bœuf marinées aux épices africaines', 5000, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444452', '22222222-2222-2222-2222-222222222222', 'Akpan', 'Bouillie de maïs fermenté avec lait sucré, dessert togolais', 1500, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop', true),

-- Restauration Occidentale
('44444444-4444-4444-4444-444444444445', '33333333-3333-3333-3333-333333333333', 'Burger Karyy''s', 'Steak haché, cheddar fondant, salade, sauce secrète maison', 4500, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444446', '33333333-3333-3333-3333-333333333333', 'Pizza Margherita', 'Sauce tomate, mozzarella fondante, basilic frais', 5000, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444453', '33333333-3333-3333-3333-333333333333', 'Spaghetti Bolognaise', 'Pâtes al dente avec sauce bolognaise maison', 3500, 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444454', '33333333-3333-3333-3333-333333333333', 'Salade César', 'Romaine croquante, croutons, parmesan, sauce César', 3000, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', true),

-- Boissons
('44444444-4444-4444-4444-444444444455', '55555555-5555-5555-5555-555555555555', 'Jus de Bissap', 'Hibiscus frais, sucré et glacé - la boisson emblématique', 1000, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444456', '55555555-5555-5555-5555-555555555555', 'Jus de Gingembre', 'Gingembre frais pressé avec citron et menthe', 1000, 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=300&fit=crop', true),
('44444444-4444-4444-4444-444444444457', '55555555-5555-5555-5555-555555555555', 'Cocktail Tropical', 'Mangue, ananas, passion - un voyage exotique', 2000, 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=300&fit=crop', true);

-- 3. Accorder les permissions au service_role pour le seed API
GRANT ALL ON public.categories TO service_role;
GRANT ALL ON public.menu_items TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;
GRANT ALL ON public.deliveries TO service_role;
GRANT ALL ON public.messages TO service_role;
GRANT ALL ON public.notifications TO service_role;
GRANT ALL ON public.profiles TO service_role;
