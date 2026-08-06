import { Router } from 'express';
import {
  misRestaurantes,
  misdetallesRestaurante,
  resumenRestaurante,
  metricasRestaurante,
  cierresRestaurante,
  facturasRestaurante,
  buscarCierre,
  buscarFactura,
  reporteVentas,
  reporteServicio,
  reporteProductos,
  reporteConsecutivo,
  editarPerfil,
  cambiarPassword,
  editarRestaurante,
  resetearPasswordRest,
  comparativa,


} from '../../controllers/owner.controller/owner.controller.js';
import { verificarToken, soloOwner } from '../../middleware/auth.middleware.js';

const router = Router();

// Lista y detalle
router.get('/restaurantes', verificarToken, soloOwner, misRestaurantes);
router.get('/comparativa', verificarToken, soloOwner, comparativa);
router.get('/restaurantes/:id', verificarToken, soloOwner, misdetallesRestaurante);

// Resumen y métricas
router.get('/restaurantes/:id/resumen', verificarToken, soloOwner, resumenRestaurante);
router.get('/restaurantes/:id/metricas', verificarToken, soloOwner, metricasRestaurante);

// Cierres y facturas
router.get('/restaurantes/:id/cierres', verificarToken, soloOwner, cierresRestaurante);
router.get('/restaurantes/:id/cierres/buscar', verificarToken, soloOwner, buscarCierre);
router.get('/restaurantes/:id/facturas', verificarToken, soloOwner, facturasRestaurante);
router.get('/restaurantes/:id/facturas/:numero', verificarToken, soloOwner, buscarFactura);

// Reportes por rango
router.get('/restaurantes/:id/reportes/ventas', verificarToken, soloOwner, reporteVentas);
router.get('/restaurantes/:id/reportes/servicio', verificarToken, soloOwner, reporteServicio);
router.get('/restaurantes/:id/reportes/productos', verificarToken, soloOwner, reporteProductos);
router.get('/restaurantes/:id/reportes/consecutivo', verificarToken, soloOwner, reporteConsecutivo);


router.patch('/perfil', verificarToken, soloOwner, editarPerfil);
router.patch('/password', verificarToken, soloOwner, cambiarPassword);
router.patch('/restaurantes/:id/datos', verificarToken, soloOwner, editarRestaurante);
router.patch('/restaurantes/:id/password', verificarToken, soloOwner, resetearPasswordRest);


export default router;

