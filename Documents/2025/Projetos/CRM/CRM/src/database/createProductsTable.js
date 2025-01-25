import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

async function createProductsTable() {
    try {
        // Criar a tabela de produtos
        const { error } = await supabase
            .rpc('create_products_table', {
                sql_query: `
                    CREATE TABLE IF NOT EXISTS products (
                        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        price DECIMAL(10,2) NOT NULL,
                        image_url TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW()) NOT NULL,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW()) NOT NULL
                    );

                    -- Função para atualizar o updated_at automaticamente
                    CREATE OR REPLACE FUNCTION update_updated_at_column()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        NEW.updated_at = TIMEZONE('UTC'::text, NOW());
                        RETURN NEW;
                    END;
                    $$ language 'plpgsql';

                    -- Trigger para atualizar o updated_at
                    DROP TRIGGER IF EXISTS products_updated_at_trigger ON products;
                    CREATE TRIGGER products_updated_at_trigger
                        BEFORE UPDATE ON products
                        FOR EACH ROW
                        EXECUTE FUNCTION update_updated_at_column();
                `
            })

        if (error) throw error
        console.log('✅ Tabela de produtos criada com sucesso!')

        // Inserir alguns produtos de exemplo
        const { error: insertError } = await supabase
            .from('products')
            .insert([
                {
                    name: 'Produto Exemplo 1',
                    price: 99.99,
                    image_url: 'https://exemplo.com/imagem1.jpg'
                },
                {
                    name: 'Produto Exemplo 2',
                    price: 149.99,
                    image_url: 'https://exemplo.com/imagem2.jpg'
                }
            ])

        if (insertError) throw insertError
        console.log('✅ Produtos de exemplo inseridos com sucesso!')

    } catch (error) {
        console.error('❌ Erro:', error.message)
    }
}

createProductsTable()
