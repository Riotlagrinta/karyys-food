-- Add deliverer_id to orders
ALTER TABLE public.orders 
ADD COLUMN deliverer_id UUID REFERENCES public.profiles(id) NULL;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_deliverer_id ON public.orders(deliverer_id);
