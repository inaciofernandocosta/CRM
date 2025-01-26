import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';
import offersRouter from './routes/offers.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API do CRM está funcionando!',
    endpoints: {
      produtos: '/api/products',
      ofertas: '/api/offers'
    }
  });
});

// Rotas de produtos
app.use('/api/products', productsRouter);

// Rotas de ofertas
app.use('/api/offers', offersRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
