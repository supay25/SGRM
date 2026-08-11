import { Router } from 'express';
import { getConfig, patchConfig } from '../controllers/restaurante.controller.js';
import { verificarToken,soloRestaurante } from '../middleware/auth.middleware.js';

const router = Router();
router.use(verificarToken, soloRestaurante);
router.get('/config', getConfig);
router.patch('/config', patchConfig);
export default router;