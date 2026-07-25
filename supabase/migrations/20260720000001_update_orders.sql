ALTER TABLE public.orders 
ADD COLUMN contact_phone TEXT,
ADD COLUMN delivery_notes TEXT;

ALTER TABLE public.order_items
ADD COLUMN notes TEXT;
