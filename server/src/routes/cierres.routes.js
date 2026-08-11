// cierre.routes.js
import { Router } from 'express';
import { crear, listar, reporte, reporteDia } from '../controllers/cierre.controller.js';
import { verificarToken,soloRestaurante } from '../middleware/auth.middleware.js';

const router = Router();
router.use(verificarToken, soloRestaurante);
router.post('/', crear);
router.get('/', listar);
router.get('/resumen-hoy', reporteDia);
router.get('/:id/reporte', reporte);

export default router;