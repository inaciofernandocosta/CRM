import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY)

async function setupPolicies() {
    try {
        // Habilitar RLS na tabela products
        const { error: rls } = await supabase.rpc('enable_rls', {
            table_name: 'products'
        })
        if (rls) console.error('Erro ao habilitar RLS:', rls)

        // Política para permitir SELECT para todos
        const { error: selectPolicy } = await supabase.rpc('create_policy', {
            table_name: 'products',
            name: 'Enable read access for all users',
            definition: 'true',
            action: 'SELECT'
        })
        if (selectPolicy) console.error('Erro ao criar política SELECT:', selectPolicy)

        // Política para permitir INSERT para todos
        const { error: insertPolicy } = await supabase.rpc('create_policy', {
            table_name: 'products',
            name: 'Enable insert access for all users',
            definition: 'true',
            action: 'INSERT'
        })
        if (insertPolicy) console.error('Erro ao criar política INSERT:', insertPolicy)

        // Política para permitir UPDATE para todos
        const { error: updatePolicy } = await supabase.rpc('create_policy', {
            table_name: 'products',
            name: 'Enable update access for all users',
            definition: 'true',
            action: 'UPDATE'
        })
        if (updatePolicy) console.error('Erro ao criar política UPDATE:', updatePolicy)

        // Política para permitir DELETE para todos
        const { error: deletePolicy } = await supabase.rpc('create_policy', {
            table_name: 'products',
            name: 'Enable delete access for all users',
            definition: 'true',
            action: 'DELETE'
        })
        if (deletePolicy) console.error('Erro ao criar política DELETE:', deletePolicy)

        console.log('Políticas configuradas com sucesso!')
    } catch (error) {
        console.error('Erro ao configurar políticas:', error)
    }
}

setupPolicies()
