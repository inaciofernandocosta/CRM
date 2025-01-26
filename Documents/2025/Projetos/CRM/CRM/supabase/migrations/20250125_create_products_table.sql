-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    stock INTEGER DEFAULT 0,
    is_top_20 BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE
    ON products
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view products
CREATE POLICY "Allow authenticated users to view products"
    ON products FOR SELECT
    TO authenticated
    USING (true);

-- Allow all authenticated users to insert products
CREATE POLICY "Allow authenticated users to insert products"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow all authenticated users to update products
CREATE POLICY "Allow authenticated users to update products"
    ON products FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow all authenticated users to delete products
CREATE POLICY "Allow authenticated users to delete products"
    ON products FOR DELETE
    TO authenticated
    USING (true);

-- Insert some sample products
INSERT INTO products (name, description, price, sku, stock, is_top_20, image_url)
VALUES 
    ('iPhone 15 Pro', 'O iPhone mais avançado já criado', 9999.99, 'IPH15P-001', 50, true, 'https://example.com/iphone15.jpg'),
    ('MacBook Pro M3', 'Poder e performance incomparáveis', 15999.99, 'MBP-M3-001', 30, true, 'https://example.com/macbook.jpg'),
    ('iPad Pro', 'Sua criatividade não tem limites', 7999.99, 'IPAD-P-001', 45, true, 'https://example.com/ipad.jpg'),
    ('AirPods Pro', 'Som imersivo e cancelamento de ruído', 1999.99, 'APP-001', 100, true, 'https://example.com/airpods.jpg'),
    ('Apple Watch Series 9', 'Seu companheiro para uma vida mais saudável', 4999.99, 'AWS9-001', 60, true, 'https://example.com/watch.jpg'),
    ('iMac 24"', 'Design elegante e performance extraordinária', 12999.99, 'IMAC24-001', 25, true, 'https://example.com/imac.jpg');
