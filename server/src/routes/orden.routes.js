import { Router } from 'express';
import { verOrden, agregarProducto, quitarProducto , mover, reiniciar,ingresar } from '../controllers/orden.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/mesa/:mesaId', verificarToken, verOrden);
router.post('/mesa/:mesaId', verificarToken, agregarProducto);
router.post('/mover', verificarToken, mover);
router.delete('/item/:ordenItemId', verificarToken, quitarProducto);
router.delete('/mesa/:mesaId', verificarToken, reiniciar);
router.put('/mesa/:mesaId', verificarToken, ingresar);
export default router;