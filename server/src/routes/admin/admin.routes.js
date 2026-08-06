import { Router } from 'express';
import {
  getOwners, postOwner, patchOwnerActivo,
  getRestaurantes, postRestaurante, patchRestauranteActivo,editarPerfil,cambiarPassword
} from '../../controllers/admin/admin.controller.js';
import { verificarToken, soloSuperAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/owners', verificarToken, soloSuperAdmin, getOwners);
router.post('/owners', verificarToken, soloSuperAdmin, postOwner);
router.patch('/owners/:id/activo', verificarToken, soloSuperAdmin, patchOwnerActivo);

router.get('/restaurantes', verificarToken, soloSuperAdmin, getRestaurantes);
router.post('/restaurantes', verificarToken, soloSuperAdmin, postRestaurante);
router.patch('/restaurantes/:id/activo', verificarToken, soloSuperAdmin, patchRestauranteActivo);
router.patch('/perfil', verificarToken, soloSuperAdmin, editarPerfil);
router.patch('/password', verificarToken, soloSuperAdmin, cambiarPassword);

export default router;