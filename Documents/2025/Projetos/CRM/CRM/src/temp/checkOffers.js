import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkOffers() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .or('preco_oferta.not.is.null,off.not.is.null')

  if (error) {
    console.error('Erro ao buscar produtos:', error)
    return
  }

  console.log('Produtos com ofertas:')
  console.table(products)
}

checkOffers()
