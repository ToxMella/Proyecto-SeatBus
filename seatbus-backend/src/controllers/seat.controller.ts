import { Request, Response } from 'express';

interface Asiento {
  idAsiento: number;
  numero: string;
  estado: 'ocupado' | 'disponible' | 'proximo_a_liberarse' | 'reservado';
  etaLiberacion?: string;
}

let memoriaAsientos: Asiento[] = Array.from({ length: 40 }, (_, index) => {
  const num = index + 1;
  if (num === 5) return { idAsiento: num, numero: `${num}`, estado: 'ocupado' };
  if (num === 12) return { idAsiento: num, numero: `${num}`, estado: 'proximo_a_liberarse', etaLiberacion: '14:30' };
  return { idAsiento: num, numero: `${num}`, estado: 'disponible' };
});

export const obtenerMapaAsientos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idBus } = req.params;
    res.status(200).json({ busId: idBus, totalAsientos: 40, asientos: memoriaAsientos });
  } catch (error) {
    res.status(500).json({ error: 'Error interno en el servidor.' });
  }
};

export const reservarAsiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idAsiento } = req.params;
    const asientoIndex = memoriaAsientos.findIndex(a => a.idAsiento === parseInt(idAsiento as string));

    if (asientoIndex === -1) {
      res.status(404).json({ error: 'Asiento no encontrado.' });
      return;
    }

    const asiento = memoriaAsientos[asientoIndex];

    if (asiento.estado === 'ocupado' || asiento.estado === 'reservado') {
      res.status(409).json({ 
        error: 'COLISION_DETECTADA', 
        mensaje: 'Lo sentimos, este asiento acaba de ser reservado por otro usuario.' 
      });
      return;
    }

    memoriaAsientos[asientoIndex].estado = 'reservado';

    res.status(200).json({
      status: 'EXITOSO',
      mensaje: `Asiento ${asiento.numero} reservado correctamente por 10 minutos.`,
      asiento: memoriaAsientos[asientoIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno en el servidor.' });
  }
};