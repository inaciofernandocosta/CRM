import { supabase } from './supabaseClient';

async function testConnection() {
  // Testa a conexão básica
  const { data, error } = await supabase.auth.getSession();
  console.log('Sessão atual:', data);
  console.log('Erro de sessão:', error);

  // Tenta uma operação simples de select
  const { data: products, error: selectError } = await supabase
    .from('products')
    .select('*')
    .limit(1);
  
  console.log('Teste de select:', products);
  console.log('Erro de select:', selectError);
}

testConnection();
