import { Router } from 'express';
import { verOrden, agregarProducto, quitarProducto , mover, reiniciar,ingresar } from '../controllers/orden.controller.js';
import { verificarToken, soloRestaurante} from '../middleware/auth.middleware.js';

const router = Router();

router.use(verificarToken, soloRestaurante);

router.get('/mesa/:mesaId', verOrden);
router.post('/mesa/:mesaId', agregarProducto);
router.post('/mover', mover);
router.delete('/item/:ordenItemId', quitarProducto);
router.delete('/mesa/:mesaId', reiniciar);
router.put('/mesa/:mesaId', ingresar);
export default router;