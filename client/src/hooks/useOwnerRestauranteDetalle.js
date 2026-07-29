import { useEffect, useState } from 'react'
import {
  getDetalleRestauranteRequest,
  getResumenRestauranteRequest,
  getMetricasRestauranteRequest,
  getCierresRestauranteRequest,
  buscarFacturaPorNumeroRequest,
  buscarCierrePorFechaRequest,

} from '../api/owner.api.js'

export default function useOwnerRestauranteDetalle(restauranteId) {
  const [cargando, setCargando] = useState(true)
  const [restaurante, setRestaurante] = useState(null)
  const [resumen, setResumen] = useState(null)
  const [metricas, setMetricas] = useState(null)
  const [cierres, setCierres] = useState([])

  const buscarFacturaPorNumero = async (numero) => {
    return await buscarFacturaPorNumeroRequest(restauranteId, numero)
  }

  const buscarCierrePorFecha = async (fecha) => {
    return await buscarCierrePorFechaRequest(restauranteId, fecha)
  }

  useEffect(() => {
    const cargar = async () => {
      try {
        const [detalleData, resumenData, metricasData, cierresData] = await Promise.all([
          getDetalleRestauranteRequest(restauranteId),
          getResumenRestauranteRequest(restauranteId),
          getMetricasRestauranteRequest(restauranteId),
          getCierresRestauranteRequest(restauranteId),
        ])
        setRestaurante(detalleData)
        setResumen(resumenData)
        setMetricas(metricasData)
        setCierres(cierresData)
      } catch (error) {
        console.error('Error al cargar el detalle del restaurante:', error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [restauranteId])

  return { cargando, restaurante, resumen, metricas, cierres, buscarFacturaPorNumero, buscarCierrePorFecha}
}


