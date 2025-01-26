import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carrega as variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY precisam estar configuradas no arquivo .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseConnection() {
    try {
        // Tenta fazer uma query simples para testar a conexão
        const { data, error } = await supabase
            .from('products')  // Substitua pelo nome de uma tabela que existe no seu banco
            .select('count')
            .limit(1)

        if (error) throw error

        console.log('✅ Conexão com Supabase estabelecida com sucesso!')
        console.log('📊 Resultado do teste:', data)
        
    } catch (error) {
        console.error('❌ Erro ao conectar com Supabase:', error.message)
    }
}

// Executa o teste
testSupabaseConnection()
