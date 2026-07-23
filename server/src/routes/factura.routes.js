import { Router } from 'express';
import { crear, listar, anular, obtener} from '../controllers/factura.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', verificarToken, crear);
router.get('/', verificarToken, listar);
router.patch('/:id/anular', verificarToken, anular);
router.get('/:id', verificarToken, obtener);
export default router;