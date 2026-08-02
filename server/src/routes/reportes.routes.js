import { Router } from 'express';
import {
  misVentas,
  misServicio,
  misProductos,
  misConsecutivo,
  misBuscarCierre,
  misBuscarFactura,
} from '../controllers/reportes.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/ventas', verificarToken, misVentas);
router.get('/servicio', verificarToken, misServicio);
router.get('/productos', verificarToken, misProductos);
router.get('/consecutivo', verificarToken, misConsecutivo);
router.get('/cierres/buscar', verificarToken, misBuscarCierre);
router.get('/facturas/:numero', verificarToken, misBuscarFactura);

export default router;