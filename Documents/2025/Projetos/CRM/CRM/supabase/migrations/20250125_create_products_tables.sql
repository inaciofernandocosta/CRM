-- Habilitar a extensão UUID se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar a tabela de produtos se não existir
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_top_20 BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar ou substituir a função do trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Remover o trigger se existir e criar novamente
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE
    ON products
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security) se ainda não estiver habilitado
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'products'
        AND rowsecurity = true
    ) THEN
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Remover políticas existentes e criar novas
DROP POLICY IF EXISTS "Permitir leitura para todos os usuários autenticados" ON products;
DROP POLICY IF EXISTS "Permitir inserção para usuários autenticados" ON products;
DROP POLICY IF EXISTS "Permitir atualização para usuários autenticados" ON products;
DROP POLICY IF EXISTS "Permitir deleção para usuários autenticados" ON products;

-- Criar políticas de segurança
CREATE POLICY "Permitir leitura para todos os usuários autenticados"
    ON products FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir inserção para usuários autenticados"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir atualização para usuários autenticados"
    ON products FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir deleção para usuários autenticados"
    ON products FOR DELETE
    TO authenticated
    USING (true);

-- Inserir dados de exemplo (apenas se a tabela estiver vazia)
INSERT INTO products (name, description, price, image_url, is_top_20)
SELECT * FROM (VALUES
    ('iPhone 15 Pro', 'O iPhone mais avançado já criado', 9999.99, 'https://example.com/iphone15.jpg', true),
    ('MacBook Pro M3', 'Poder e performance incomparáveis', 15999.99, 'https://example.com/macbook.jpg', true),
    ('iPad Pro', 'Sua criatividade não tem limites', 7999.99, 'https://example.com/ipad.jpg', true),
    ('AirPods Pro', 'Som imersivo e cancelamento de ruído', 1999.99, 'https://example.com/airpods.jpg', true),
    ('Apple Watch Series 9', 'Seu companheiro para uma vida mais saudável', 4999.99, 'https://example.com/watch.jpg', true),
    ('iMac 24"', 'Design elegante e performance extraordinária', 12999.99, 'https://example.com/imac.jpg', true)
) AS v(name, description, price, image_url, is_top_20)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- Queries úteis para manipulação dos dados
COMMENT ON TABLE products IS 'Tabela de produtos do CRM';

-- Exemplos de queries (comentadas para não executar automaticamente):

/*
-- Buscar todos os produtos
SELECT * FROM products ORDER BY name ASC;

-- Buscar apenas produtos TOP 20
SELECT * FROM products WHERE is_top_20 = true ORDER BY name ASC;

-- Buscar produtos por faixa de preço
SELECT * FROM products WHERE price BETWEEN $1 AND $2 ORDER BY price ASC;

-- Buscar produtos por texto
SELECT * FROM products 
WHERE name ILIKE '%' || $1 || '%' 
   OR description ILIKE '%' || $1 || '%'
ORDER BY name ASC;

-- Inserir novo produto
INSERT INTO products (name, description, price, image_url, is_top_20)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- Atualizar produto
UPDATE products 
SET name = $2,
    description = $3,
    price = $4,
    image_url = $5,
    is_top_20 = $6,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- Marcar/Desmarcar como TOP 20
UPDATE products 
SET is_top_20 = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- Deletar produto
DELETE FROM products WHERE id = $1 RETURNING *;
*/
