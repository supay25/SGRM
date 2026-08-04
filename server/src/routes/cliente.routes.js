// cliente.routes.js
import { Router } from 'express';
import { listar, crear, actualizar, eliminar } from '../controllers/cliente.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', verificarToken, listar);
router.post('/', verificarToken, crear);
router.put('/:id', verificarToken, actualizar);
router.delete('/:id', verificarToken, eliminar);
export default router;