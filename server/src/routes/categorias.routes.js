import { Router } from 'express';
import {crear, listar, actualizar, eliminar} from '../controllers/categoria.controller.js';
import {verificarToken,soloRestaurante} from '../middleware/auth.middleware.js'
const router= Router();
router.use(verificarToken, soloRestaurante);
router.post('/', crear);
router.get('/', listar);
router.put('/:id', actualizar );
router.delete('/:id', eliminar)
export default router;
