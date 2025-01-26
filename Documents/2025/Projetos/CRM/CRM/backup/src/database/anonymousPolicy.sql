-- Remover políticas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for all users" ON products;
DROP POLICY IF EXISTS "Enable update for all users" ON products;
DROP POLICY IF EXISTS "Enable delete for all users" ON products;
DROP POLICY IF EXISTS "Public access" ON products;

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Criar política para usuários anônimos
CREATE POLICY "Allow anonymous access"
ON products
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Criar política para usuários autenticados
CREATE POLICY "Allow authenticated access"
ON products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
