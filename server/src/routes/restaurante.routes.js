import { Router } from 'express';
import { getConfig, patchConfig } from '../controllers/restaurante.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/config', verificarToken, getConfig);
router.patch('/config', verificarToken, patchConfig);
export default router;