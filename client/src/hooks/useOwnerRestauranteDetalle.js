import { useCallback, useEffect, useState } from 'react'

// TODO: GET /api/owner/restaurantes/:id/resumen — { cantidad, totalNeto, totalServicio, ingresoReal }
// TODO: GET /api/owner/restaurantes/:id/metricas — { masVendidos, porSeccion, tendencia }
// TODO: GET /api/owner/restaurantes/:id/cierres — [{ id, fecha, primeraFactura, ultimaFactura, ingresoReal }]
// TODO: GET /api/owner/restaurantes/:id/facturas — [{ id, numeroFactura, nombreMesa, seccion: {nombre}, fecha, montoNeto }]

const MOCK_DB = {
  1: {
    resumen: { cantidad: 42, totalNeto: '812450.00', totalServicio: '81245.00', ingresoReal: '731205.00' },
    metricas: {
      masVendidos: [
        { producto: 'Casado de pollo', cantidad: 38 },
        { producto: 'Cerveza Imperial', cantidad: 34 },
        { producto: 'Ceviche de pescado', cantidad: 27 },
        { producto: 'Arroz con camarones', cantidad: 21 },
        { producto: 'Refresco natural', cantidad: 19 },
      ],
      porSeccion: [
        { seccion: 'Salón', total: '498200.00', facturas: 26 },
        { seccion: 'Uber Eats', total: '210500.00', facturas: 11 },
        { seccion: 'Para llevar', total: '68300.00', facturas: 4 },
        { seccion: 'Rappi', total: '35450.00', facturas: 1 },
      ],
      tendencia: [
        { fecha: '2026-07-20', ingresoReal: '645300.00' },
        { fecha: '2026-07-21', ingresoReal: '598100.00' },
        { fecha: '2026-07-22', ingresoReal: '712400.00' },
        { fecha: '2026-07-23', ingresoReal: '680900.00' },
        { fecha: '2026-07-24', ingresoReal: '755600.00' },
        { fecha: '2026-07-25', ingresoReal: '702300.00' },
        { fecha: '2026-07-26', ingresoReal: '731205.00' },
      ],
    },
    cierres: [
      { id: 106, fecha: '2026-07-26', primeraFactura: 301, ultimaFactura: 342, ingresoReal: '731205.00' },
      { id: 105, fecha: '2026-07-25', primeraFactura: 260, ultimaFactura: 300, ingresoReal: '702300.00' },
      { id: 104, fecha: '2026-07-24', primeraFactura: 221, ultimaFactura: 259, ingresoReal: '755600.00' },
      { id: 103, fecha: '2026-07-23', primeraFactura: 185, ultimaFactura: 220, ingresoReal: '680900.00' },
    ],
    facturas: [
      { id: 342, numeroFactura: 342, nombreMesa: 'Mesa 5', seccion: { nombre: 'Salón' }, fecha: '2026-07-26T19:42:00', montoNeto: '18450.00' },
      { id: 341, numeroFactura: 341, nombreMesa: 'Uber Eats', seccion: { nombre: 'Uber Eats' }, fecha: '2026-07-26T19:20:00', montoNeto: '12300.00' },
      { id: 340, numeroFactura: 340, nombreMesa: 'Mesa 2', seccion: { nombre: 'Salón' }, fecha: '2026-07-26T18:55:00', montoNeto: '24900.00' },
      { id: 339, numeroFactura: 339, nombreMesa: 'Para llevar 1', seccion: { nombre: 'Para llevar' }, fecha: '2026-07-26T18:30:00', montoNeto: '9800.00' },
      { id: 338, numeroFactura: 338, nombreMesa: 'Mesa 8', seccion: { nombre: 'Salón' }, fecha: '2026-07-26T18:10:00', montoNeto: '31200.00' },
      { id: 337, numeroFactura: 337, nombreMesa: 'Rappi', seccion: { nombre: 'Rappi' }, fecha: '2026-07-26T17:48:00', montoNeto: '15600.00' },
    ],
  },
  2: {
    resumen: { cantidad: 18, totalNeto: '345900.00', totalServicio: '34590.00', ingresoReal: '311310.00' },
    metricas: {
      masVendidos: [
        { producto: 'Pescado entero frito', cantidad: 16 },
        { producto: 'Arroz con mariscos', cantidad: 12 },
        { producto: 'Cerveza Pilsen', cantidad: 11 },
        { producto: 'Patacones', cantidad: 9 },
        { producto: 'Limonada', cantidad: 7 },
      ],
      porSeccion: [
        { seccion: 'Salón', total: '289400.00', facturas: 15 },
        { seccion: 'Para llevar', total: '56500.00', facturas: 3 },
      ],
      tendencia: [
        { fecha: '2026-07-20', ingresoReal: '280100.00' },
        { fecha: '2026-07-21', ingresoReal: '295400.00' },
        { fecha: '2026-07-22', ingresoReal: '260800.00' },
        { fecha: '2026-07-23', ingresoReal: '302200.00' },
        { fecha: '2026-07-24', ingresoReal: '318900.00' },
        { fecha: '2026-07-25', ingresoReal: '299500.00' },
        { fecha: '2026-07-26', ingresoReal: '311310.00' },
      ],
    },
    cierres: [
      { id: 88, fecha: '2026-07-26', primeraFactura: 140, ultimaFactura: 158, ingresoReal: '311310.00' },
      { id: 87, fecha: '2026-07-25', primeraFactura: 121, ultimaFactura: 139, ingresoReal: '299500.00' },
    ],
    facturas: [
      { id: 158, numeroFactura: 158, nombreMesa: 'Mesa 3', seccion: { nombre: 'Salón' }, fecha: '2026-07-26T20:05:00', montoNeto: '22100.00' },
      { id: 157, numeroFactura: 157, nombreMesa: 'Para llevar 2', seccion: { nombre: 'Para llevar' }, fecha: '2026-07-26T19:40:00', montoNeto: '11400.00' },
    ],
  },
  3: {
    resumen: { cantidad: 0, totalNeto: '0.00', totalServicio: '0.00', ingresoReal: '0.00' },
    metricas: { masVendidos: [], porSeccion: [], tendencia: [] },
    cierres: [],
    facturas: [],
  },
}

const DETALLE_VACIO = {
  resumen: { cantidad: 0, totalNeto: '0.00', totalServicio: '0.00', ingresoReal: '0.00' },
  metricas: { masVendidos: [], porSeccion: [], tendencia: [] },
  cierres: [],
  facturas: [],
}

export default function useOwnerRestauranteDetalle(restauranteId) {
  const [cargando, setCargando] = useState(true)
  const [resumen, setResumen] = useState(DETALLE_VACIO.resumen)
  const [metricas, setMetricas] = useState(DETALLE_VACIO.metricas)
  const [cierres, setCierres] = useState(DETALLE_VACIO.cierres)
  const [facturas, setFacturas] = useState(DETALLE_VACIO.facturas)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const datos = MOCK_DB[restauranteId] ?? DETALLE_VACIO
      setResumen(datos.resumen)
      setMetricas(datos.metricas)
      setCierres(datos.cierres)
      setFacturas(datos.facturas)
    } catch (error) {
      console.error('Error al cargar el detalle del restaurante:', error)
    } finally {
      setCargando(false)
    }
  }, [restauranteId])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { cargando, resumen, metricas, cierres, facturas }
}
