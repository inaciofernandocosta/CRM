-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for all users" ON products;
DROP POLICY IF EXISTS "Enable update for all users" ON products;
DROP POLICY IF EXISTS "Enable delete for all users" ON products;

-- Create policies
CREATE POLICY "Enable read access for all users" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for all users" 
ON products FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for all users" 
ON products FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for all users" 
ON products FOR DELETE 
USING (true);

-- Add description column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'description') 
    THEN
        ALTER TABLE products ADD COLUMN description TEXT;
    END IF;
END $$;
