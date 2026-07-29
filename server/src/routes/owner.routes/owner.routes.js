// owner.routes.js
import { Router } from 'express';
import { misRestaurantes, resumenRestaurante, cierres, facturas, metricas,buscarCierre,buscarFactura, misdetallesRestaurante} from '../../controllers/owner.controller/owner.controller.js';
import { verificarToken, soloOwner } from '../../middleware/auth.middleware.js';

const router = Router();
router.get('/restaurantes', verificarToken, soloOwner, misRestaurantes);
router.get('/restaurantes/:id', verificarToken, soloOwner, misdetallesRestaurante);  
router.get('/restaurantes/:id/resumen', verificarToken, soloOwner, resumenRestaurante);
router.get('/restaurantes/:id/metricas', verificarToken, soloOwner, metricas);
router.get('/restaurantes/:id/cierres', verificarToken, soloOwner, cierres);
router.get('/restaurantes/:id/facturas', verificarToken, soloOwner, facturas);
router.get('/restaurantes/:id/facturas/:numero', verificarToken, soloOwner, buscarFactura);
router.get('/restaurantes/:id/cierres/buscar', verificarToken, soloOwner, buscarCierre);
export default router;