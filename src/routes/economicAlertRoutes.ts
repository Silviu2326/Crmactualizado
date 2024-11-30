import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/economic-alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await prisma.economicAlert.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(alerts);
  } catch (error) {
    console.error('Error al obtener las alertas económicas:', error);
    res.status(500).json({ error: 'Error al obtener las alertas económicas' });
  }
});

// POST /api/economic-alerts
router.post('/', async (req, res) => {
  try {
    const { mensaje, tipo } = req.body;
    const newAlert = await prisma.economicAlert.create({
      data: {
        mensaje,
        tipo,
        createdAt: new Date()
      }
    });
    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error al crear la alerta económica:', error);
    res.status(500).json({ error: 'Error al crear la alerta económica' });
  }
});

// DELETE /api/economic-alerts/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.economicAlert.delete({
      where: {
        id: parseInt(id)
      }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar la alerta económica:', error);
    res.status(500).json({ error: 'Error al eliminar la alerta económica' });
  }
});

export default router;
