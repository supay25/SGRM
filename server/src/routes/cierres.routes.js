// cierre.routes.js
import { Router } from 'express';
import { crear, listar, reporte, reporteDia } from '../controllers/cierre.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/', verificarToken, crear);
router.get('/', verificarToken, listar);
router.get('/resumen-hoy', verificarToken, reporteDia);
router.get('/:id/reporte', verificarToken, reporte);

export default router;