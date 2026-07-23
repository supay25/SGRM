import { useCallback, useEffect, useMemo, useState } from 'react'
// TODO: cuando el backend esté listo, importar y usar getCierresRequest / crearCierreRequest / getCierreReporteRequest
// import { getCierresRequest, crearCierreRequest, getCierreReporteRequest } from '../api/cierres.api'

// Facturas del día en curso — mismo set de datos que useFacturas, usado aquí
// solo para calcular el resumen en vivo mientras el día no está cerrado.
const FACTURAS_HOY_MOCK = [
  { numeroFactura: 1, subtotal: '12000', montoServicio: '1200', montoNeto: '13200' },
  { numeroFactura: 2, subtotal: '18500', montoServicio: '1850', montoNeto: '20350' },
  { numeroFactura: 3, subtotal: '9000', montoServicio: '0', montoNeto: '9000' },
  { numeroFactura: 4, subtotal: '25400', montoServicio: '2540', montoNeto: '27940' },
  { numeroFactura: 5, subtotal: '15800', montoServicio: '0', montoNeto: '12640' },
  { numeroFactura: 6, subtotal: '32000', montoServicio: '3200', montoNeto: '35200' },
  { numeroFactura: 7, subtotal: '8900', montoServicio: '890', montoNeto: '9790' },
  { numeroFactura: 8, subtotal: '21000', montoServicio: '2100', montoNeto: '23100' },
]

const ANULADOS_HOY_MOCK = [
  { nombreProducto: 'Papas fritas', cantidad: 1, nombreMesa: 'Mesa 7', fecha: '2026-07-22T11:20:00' },
  { nombreProducto: 'Refresco natural', cantidad: 2, nombreMesa: 'Mesa 3', fecha: '2026-07-22T09:30:00' },
]

const HISTORIAL_MOCK = [
  {
    id: 'c-2026-07-21',
    fecha: '2026-07-21',
    primeraFactura: 1,
    ultimaFactura: 11,
    totalNeto: 198500,
    totalServicio: 15300,
    ingresoReal: 183200,
  },
  {
    id: 'c-2026-07-20',
    fecha: '2026-07-20',
    primeraFactura: 1,
    ultimaFactura: 9,
    totalNeto: 162300,
    totalServicio: 12100,
    ingresoReal: 150200,
  },
  {
    id: 'c-2026-07-19',
    fecha: '2026-07-19',
    primeraFactura: 1,
    ultimaFactura: 7,
    totalNeto: 121400,
    totalServicio: 9800,
    ingresoReal: 111600,
  },
]

function calcularResumen(facturas) {
  const numeros = facturas.map((f) => f.numeroFactura)
  const totalNeto = facturas.reduce((acc, f) => acc + Number(f.montoNeto), 0)
  const totalServicio = facturas.reduce((acc, f) => acc + Number(f.montoServicio), 0)
  return {
    cantidad: facturas.length,
    primeraFactura: numeros.length ? Math.min(...numeros) : 0,
    ultimaFactura: numeros.length ? Math.max(...numeros) : 0,
    totalNeto,
    totalServicio,
    ingresoReal: totalNeto - totalServicio,
  }
}

export default function useCierreCaja() {
  const [cargando, setCargando] = useState(true)
  const [facturasHoy, setFacturasHoy] = useState([])
  const [anulados, setAnulados] = useState([])
  const [cierreHoy, setCierreHoy] = useState(null)
  const [historial, setHistorial] = useState([])
  const [cerrando, setCerrando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        // TODO: reemplazar por: const cierres = await getCierresRequest()
        // (el backend indica si el día de hoy ya tiene cierre)
        setFacturasHoy(FACTURAS_HOY_MOCK)
        setAnulados(ANULADOS_HOY_MOCK)
        setHistorial(HISTORIAL_MOCK)
      } catch (error) {
        console.error('Error al cargar el cierre de caja:', error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const resumenHoy = useMemo(() => calcularResumen(facturasHoy), [facturasHoy])

  const cerrarCaja = useCallback(async () => {
    setCerrando(true)
    try {
      // TODO: reemplazar por: const cierre = await crearCierreRequest()
      const nuevoCierre = {
        id: `c-hoy`,
        fecha: new Date().toISOString().slice(0, 10),
        ...resumenHoy,
      }
      setCierreHoy(nuevoCierre)
      setHistorial((prev) => [nuevoCierre, ...prev])
    } catch (error) {
      alert(error.response?.data?.error || 'Error al cerrar la caja')
    } finally {
      setCerrando(false)
    }
  }, [resumenHoy])

  return {
    cargando,
    diaCerrado: cierreHoy !== null,
    resumenHoy: cierreHoy ?? resumenHoy,
    anulados,
    historial,
    cerrando,
    cerrarCaja,
  }
}
