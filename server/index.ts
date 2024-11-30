import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import economicAlertRoutes from '../src/routes/economicAlertRoutes';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/economic-alerts', economicAlertRoutes);

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Cerrar Prisma al terminar
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
