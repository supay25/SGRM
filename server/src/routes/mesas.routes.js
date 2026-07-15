import { Router } from 'express';
import {crear, listar, actualizar, eliminar} from '../controllers/mesa.controller.js';
import {verificarToken} from '../middleware/auth.middleware.js'
const router= Router();

router.post('/', verificarToken, crear);
router.get('/', verificarToken, listar);
router.put('/:id', verificarToken, actualizar );
router.delete('/:id', verificarToken, eliminar)
export default router;
