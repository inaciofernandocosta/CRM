import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const app = express();

app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API do CRM está funcionando!',
    endpoints: {
      produtos: {
        listar: 'GET /api/products',
        buscar: 'GET /api/products/:id',
        criar: 'POST /api/products',
        atualizar: 'PUT /api/products/:id',
        deletar: 'DELETE /api/products/:id'
      }
    }
  });
});

// Rotas para Produtos
app.get('/api/products', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar um produto específico
app.get('/api/products/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar um produto
app.put('/api/products/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para deletar um produto
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Categorias
app.get('/api/categories', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');

    if (error) throw error;
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`
📦 Rotas disponíveis:
GET    /api/products     - Lista todos os produtos
GET    /api/products/:id - Busca um produto específico
POST   /api/products     - Cria um novo produto
PUT    /api/products/:id - Atualiza um produto
DELETE /api/products/:id - Deleta um produto
GET    /api/categories   - Lista todas as categorias
POST   /api/categories   - Cria uma nova categoria
  `);
});
