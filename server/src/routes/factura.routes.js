import { Router } from 'express';
import { crear, listar, anular, obtener, editarCliente,facturarDividido} from '../controllers/factura.controller.js';
import { verificarToken , soloRestaurante} from '../middleware/auth.middleware.js';

const router = Router();
router.use(verificarToken, soloRestaurante);

router.post('/', crear);
router.get('/', listar);
router.patch('/:id/anular', anular);
router.get('/:id', obtener);
router.patch('/:id/cliente', editarCliente);
router.post('/dividir', facturarDividido);
export default router;