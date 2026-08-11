// cliente.routes.js
import { Router } from 'express';
import { listar, crear, actualizar, eliminar } from '../controllers/cliente.controller.js';
import { verificarToken,soloRestaurante } from '../middleware/auth.middleware.js';

const router = Router();
router.use(verificarToken, soloRestaurante);
router.get('/', listar);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);
export default router;