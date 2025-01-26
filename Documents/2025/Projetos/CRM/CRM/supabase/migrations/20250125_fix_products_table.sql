-- Remover a coluna 'false' se ela existir
ALTER TABLE products DROP COLUMN IF EXISTS "false";

-- Verificar e corrigir os tipos das colunas
ALTER TABLE products
    ALTER COLUMN price TYPE DECIMAL(10,2),
    ALTER COLUMN is_top_20 SET DEFAULT false,
    ALTER COLUMN description TYPE TEXT,
    ALTER COLUMN image_url TYPE TEXT;
