import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY)

async function setupStorage() {
    try {
        // Criar o bucket para imagens de produtos se não existir
        const { data: buckets, error: bucketsError } = await supabase
            .storage
            .listBuckets()

        if (bucketsError) {
            console.error('Erro ao listar buckets:', bucketsError)
            return
        }

        const productImagesBucket = buckets.find(b => b.name === 'product-images')
        
        if (!productImagesBucket) {
            console.log('Criando bucket product-images...')
            const { error: createError } = await supabase
                .storage
                .createBucket('product-images', {
                    public: true
                })

            if (createError) {
                console.error('Erro ao criar bucket:', createError)
                return
            }
            console.log('Bucket product-images criado com sucesso!')
        } else {
            console.log('Bucket product-images já existe.')

            // Atualizar configurações do bucket
            const { error: updateError } = await supabase
                .storage
                .updateBucket('product-images', {
                    public: true
                })

            if (updateError) {
                console.error('Erro ao atualizar bucket:', updateError)
                return
            }
            console.log('Bucket atualizado com sucesso!')
        }

        // Criar política de acesso público para leitura
        const { error: policyError } = await supabase.rpc('create_storage_policy', {
            bucket_name: 'product-images',
            policy_name: 'Public Access',
            definition: 'TRUE'
        })

        if (policyError) {
            console.error('Erro ao criar política:', policyError)
            return
        }

        console.log('Setup do storage concluído com sucesso!')
    } catch (error) {
        console.error('Erro ao configurar storage:', error)
    }
}

setupStorage()
