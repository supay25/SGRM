import { Router } from 'express';
import {crear, listar, actualizar, eliminar, obtener } from '../controllers/mesa.controller.js';
import {verificarToken,soloRestaurante} from '../middleware/auth.middleware.js'
const router= Router();
router.use(verificarToken, soloRestaurante);
router.post('/', crear);
router.get('/', listar);
router.get('/:id', obtener);
router.put('/:id', actualizar );
router.delete('/:id', eliminar)
export default router;
