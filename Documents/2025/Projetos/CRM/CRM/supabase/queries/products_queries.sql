-- Consulta básica de todos os produtos
SELECT 
    id,
    name,
    description,
    price,
    preco_oferta,
    off,
    image_url,
    is_top_20,
    created_at,
    updated_at
FROM products
ORDER BY name ASC;

-- Consulta apenas produtos TOP 20
SELECT 
    id,
    name,
    description,
    price,
    preco_oferta,
    off,
    image_url,
    is_top_20,
    created_at,
    updated_at
FROM products
WHERE is_top_20 = true
ORDER BY name ASC;

-- Consulta produtos com filtro de preço (exemplo entre 1000 e 5000)
SELECT 
    id,
    name,
    description,
    price,
    preco_oferta,
    off,
    image_url,
    is_top_20,
    created_at,
    updated_at
FROM products
WHERE price BETWEEN 1000 AND 5000
ORDER BY price ASC;

-- Consulta produtos por texto (exemplo buscando 'iPhone')
SELECT 
    id,
    name,
    description,
    price,
    preco_oferta,
    off,
    image_url,
    is_top_20,
    created_at,
    updated_at
FROM products
WHERE 
    name ILIKE '%iPhone%'
    OR description ILIKE '%iPhone%'
ORDER BY name ASC;

-- Consulta produtos em oferta
SELECT 
    id,
    name,
    description,
    price,
    preco_oferta,
    off,
    image_url,
    is_top_20,
    created_at,
    updated_at
FROM products
WHERE 
    preco_oferta IS NOT NULL
    AND off IS NOT NULL
ORDER BY off DESC;

-- Inserir novo produto (exemplo)
INSERT INTO products (
    name,
    description,
    price,
    preco_oferta,
    off,
    image_url,
    is_top_20
) VALUES (
    'iPhone 15',
    'Novo iPhone com recursos incríveis',
    7999.99,
    6999.99,
    15,
    'https://example.com/iphone15.jpg',
    true
) RETURNING *;

-- Atualizar produto (exemplo com ID específico)
UPDATE products
SET 
    name = 'iPhone 15 Pro Max',
    description = 'Versão atualizada do iPhone',
    price = 8999.99,
    preco_oferta = 7999.99,
    off = 10,
    image_url = 'https://example.com/iphone15promax.jpg',
    is_top_20 = true,
    updated_at = CURRENT_TIMESTAMP
WHERE id = '00000000-0000-0000-0000-000000000000' -- Substitua pelo ID real
RETURNING *;

-- Marcar/Desmarcar produto como TOP 20 (exemplo com ID específico)
UPDATE products
SET 
    is_top_20 = true,
    updated_at = CURRENT_TIMESTAMP
WHERE id = '00000000-0000-0000-0000-000000000000' -- Substitua pelo ID real
RETURNING *;

-- Deletar produto (exemplo com ID específico)
DELETE FROM products
WHERE id = '00000000-0000-0000-0000-000000000000' -- Substitua pelo ID real
RETURNING *;
