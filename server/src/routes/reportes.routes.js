import { Router } from 'express';
import {
  misVentas,
  misServicio,
  misProductos,
  misConsecutivo,
  misBuscarCierre,
  misBuscarFactura,
} from '../controllers/reportes.controller.js';
import { verificarToken, soloRestaurante } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verificarToken, soloRestaurante);

router.get('/ventas', misVentas);
router.get('/servicio', misServicio);
router.get('/productos', misProductos);
router.get('/consecutivo', misConsecutivo);
router.get('/cierres/buscar', misBuscarCierre);
router.get('/facturas/:numero', misBuscarFactura);

export default router;