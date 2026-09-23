import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validarIngresoPasaje = [
  body('rut')
    .notEmpty().withMessage('El RUT es obligatorio.')
    .matches(/^[0-9]+-[0-9kK]{1}$/).withMessage('Formato de RUT inválido.'),

  body('fechaViaje')
    .notEmpty().withMessage('La fecha es obligatoria.')
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(20\d\d)$/).withMessage('Formato debe ser DD/MM/YYYY.')
    .custom((value) => {
      const [dia, mes, anio] = value.split('/');
      const fechaViaje = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
      
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const limite = new Date();
      limite.setMonth(limite.getMonth() + 6);
      limite.setHours(0, 0, 0, 0);

      if (fechaViaje < hoy) {
        throw new Error('La fecha del viaje no puede estar en el pasado.');
      }

      if (fechaViaje > limite) {
        throw new Error('La fecha del viaje no puede exceder los 6 meses desde hoy.');
      }

      return true;
    }),

  body('origen')
    .notEmpty().withMessage('El origen es obligatorio.'),
  
  body('destino')
    .notEmpty().withMessage('El destino es obligatorio.')
    .custom((destino, { req }) => {
      if (destino === req.body.origen) {
        throw new Error('El origen y el destino no pueden ser el mismo lugar.');
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction): void => {
    const errores = validationResult(req);
    
    if (!errores.isEmpty()) {
      res.status(400).json({ 
        status: 'ERROR', 
        mensaje: errores.array()[0].msg 
      });
      return;
    }
    
    next();
  }
];