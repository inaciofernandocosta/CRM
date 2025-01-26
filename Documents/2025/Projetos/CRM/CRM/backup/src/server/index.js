import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const app = express();
const port = process.env.PORT || 3001;

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

// Rotas
app.use('/api/products', productsRouter);

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

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
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
