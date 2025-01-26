import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

async function insertSampleProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    name: 'Notebook Pro X',
                    price: 4999.99,
                    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'
                },
                {
                    name: 'Smartphone Galaxy Ultra',
                    price: 3499.99,
                    image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd'
                },
                {
                    name: 'Headphone Wireless',
                    price: 599.99,
                    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
                }
            ])
            .select()

        if (error) throw error

        console.log('✅ Produtos inseridos com sucesso!')
        console.log('📦 Produtos:', data)

        // Vamos fazer uma consulta para verificar todos os produtos
        const { data: allProducts, error: queryError } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (queryError) throw queryError

        console.log('\n📋 Lista de todos os produtos:')
        console.table(allProducts)

    } catch (error) {
        console.error('❌ Erro:', error.message)
    }
}

insertSampleProducts()
