import { Router } from 'express';
import { crear, listar, anular, obtener, editarCliente,facturarDividido} from '../controllers/factura.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', verificarToken, crear);
router.get('/', verificarToken, listar);
router.patch('/:id/anular', verificarToken, anular);
router.get('/:id', verificarToken, obtener);
router.patch('/:id/cliente', verificarToken, editarCliente);
router.post('/dividir', verificarToken, facturarDividido);
export default router;