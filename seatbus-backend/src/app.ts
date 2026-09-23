import express, { Request, Response } from 'express';
import cors from 'cors';
import { obtenerMapaAsientos, reservarAsiento } from './controllers/seat.controller';
import { validarIngresoPasaje } from './middlewares/validation.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// --- 1. Rutas ---
app.get('/api/v1/buses/:idBus/asientos', obtenerMapaAsientos);
app.post('/api/v1/buses/:idBus/asientos/:idAsiento/reservar', reservarAsiento);

// Se agregan los ... antes del middleware y se tipan req y res
app.post('/api/v1/pasajes/validar', ...validarIngresoPasaje, (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'EXITOSO', 
    mensaje: 'Pasaje validado correctamente. Posicionando usuario en el viaje.' 
  });
});

// --- 2. Inicializacion del Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[SeatBus API] Servidor de desarrollo corriendo en puerto ${PORT}`);
});