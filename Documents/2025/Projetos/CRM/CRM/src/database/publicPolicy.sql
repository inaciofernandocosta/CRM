-- Primeiro, vamos remover todas as políticas existentes
DROP POLICY IF EXISTS "Public access" ON public.products;

-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Criar uma única política que permite tudo para todos
CREATE POLICY "Public access"
ON public.products
AS PERMISSIVE
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Garantir que o bucket de storage também está acessível
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;
