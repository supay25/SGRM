import { useEffect, useState } from 'react'
import {
  getDetalleRestauranteRequest,
  getResumenRestauranteRequest,
  getMetricasRestauranteRequest,
  getCierresRestauranteRequest,
  buscarFacturaPorNumeroRequest,
  buscarCierrePorFechaRequest,
  getReporteVentasRequest,
  getReporteServicioRequest,
  getReporteProductosRequest,
  getReporteConsecutivoRequest,
} from '../api/owner.api.js'
import { rangoUltimos30Dias } from '../utils/fechas.js'

export default function useOwnerRestauranteDetalle(restauranteId) {
  const [cargando, setCargando] = useState(true)
  const [restaurante, setRestaurante] = useState(null)
  const [resumen, setResumen] = useState(null)
  const [metricas, setMetricas] = useState(null)
  const [cierres, setCierres] = useState([])

  // Las métricas tienen su propio rango: al montar, los últimos 30 días.
  const [rangoMetricas, setRangoMetricas] = useState(rangoUltimos30Dias)
  const [cargandoMetricas, setCargandoMetricas] = useState(true)

  const buscarFacturaPorNumero = async (numero) => {
    return await buscarFacturaPorNumeroRequest(restauranteId, numero)
  }

  const buscarCierrePorFecha = async (fecha) => {
    return await buscarCierrePorFechaRequest(restauranteId, fecha)
  }

  const consultarVentas = async (desde, hasta) => {
    return await getReporteVentasRequest(restauranteId, desde, hasta)
  }

  const consultarServicio = async (desde, hasta) => {
    return await getReporteServicioRequest(restauranteId, desde, hasta)
  }

  const consultarProductos = async (desde, hasta) => {
    return await getReporteProductosRequest(restauranteId, desde, hasta)
  }

  const consultarConsecutivo = async (desde, hasta) => {
    return await getReporteConsecutivoRequest(restauranteId, desde, hasta)
  }

  const cambiarRangoMetricas = (desde, hasta) => {
    if (!desde || !hasta || desde > hasta) return
    setRangoMetricas({ desde, hasta })
  }

  useEffect(() => {
    const cargar = async () => {
      try {
        const [detalleData, resumenData, cierresData] = await Promise.all([
          getDetalleRestauranteRequest(restauranteId),
          getResumenRestauranteRequest(restauranteId),
          getCierresRestauranteRequest(restauranteId),
        ])
        setRestaurante(detalleData)
        setResumen(resumenData)
        setCierres(cierresData)
      } catch (error) {
        console.error('Error al cargar el detalle del restaurante:', error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [restauranteId])

  // Se recarga solo con el rango: al montar (últimos 30 días) y con cada "Aplicar".
  useEffect(() => {
    let activo = true
    const cargarMetricas = async () => {
      setCargandoMetricas(true)
      try {
        const data = await getMetricasRestauranteRequest(
          restauranteId,
          rangoMetricas.desde,
          rangoMetricas.hasta
        )
        if (activo) setMetricas(data)
      } catch (error) {
        console.error('Error al cargar las métricas del restaurante:', error)
      } finally {
        if (activo) setCargandoMetricas(false)
      }
    }
    cargarMetricas()
    return () => {
      activo = false
    }
  }, [restauranteId, rangoMetricas.desde, rangoMetricas.hasta])

  return {
    cargando,
    restaurante,
    resumen,
    metricas,
    cierres,
    rangoMetricas,
    cargandoMetricas,
    cambiarRangoMetricas,
    buscarFacturaPorNumero,
    buscarCierrePorFecha,
    consultarVentas,
    consultarServicio,
    consultarProductos,
    consultarConsecutivo,
  }
}
