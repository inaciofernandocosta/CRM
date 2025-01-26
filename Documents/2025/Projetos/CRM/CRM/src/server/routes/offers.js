import express from 'express';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

// Rota para listar todas as ofertas
router.get('/', async (req, res) => {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        products: true, // Inclui os produtos relacionados
      },
    });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Error fetching offers' });
  }
});

// Rota para criar uma nova oferta
router.post('/', async (req, res) => {
  try {
    const { title, description, startDate, endDate, productIds } = req.body;
    
    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        products: {
          connect: productIds.map(id => ({ id: parseInt(id) }))
        }
      },
      include: {
        products: true,
      }
    });
    
    res.status(201).json(offer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Error creating offer' });
  }
});

// Rota para atualizar uma oferta existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, productIds } = req.body;
    
    const offer = await prisma.offer.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        products: {
          set: productIds.map(id => ({ id: parseInt(id) }))
        }
      },
      include: {
        products: true,
      }
    });
    
    res.json(offer);
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ error: 'Error updating offer' });
  }
});

// Rota para excluir uma oferta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.offer.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ error: 'Error deleting offer' });
  }
});

export default router;
