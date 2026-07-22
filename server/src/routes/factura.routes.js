import { Router } from 'express';
import { crear, listar } from '../controllers/factura.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', verificarToken, crear);
router.get('/', verificarToken, listar);

export default router;