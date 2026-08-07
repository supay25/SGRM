import { useCallback, useEffect, useState } from 'react'
import { getResumenHoyRequest, getCierresRequest, crearCierreRequest } from '../api/cierres.api.js'
import useAvisoError from './useAvisoError.js'

export default function useCierreCaja() {
  const avisarError = useAvisoError()
  const [cargando, setCargando] = useState(true)
  const [cerrando, setCerrando] = useState(false)
  const [resumen, setResumen] = useState(null)
  const [historial, setHistorial] = useState([])

  const cargar = useCallback(async () => {
    try {
      const [resumenData, historialData] = await Promise.all([
        getResumenHoyRequest(),
        getCierresRequest(),
      ])
      setResumen(resumenData)
      setHistorial(historialData)
    } catch (error) {
      console.error('Error al cargar el cierre:', error)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const cerrarCaja = useCallback(async () => {
    setCerrando(true)
    try {
      await crearCierreRequest()
      await cargar()
    } catch (error) {
      avisarError(error, 'Error al cerrar la caja')
    } finally {
      setCerrando(false)
    }
  }, [cargar, avisarError])

  return {
    cargando,
    cerrando,
    resumenHoy: resumen ?? {
      cantidad: 0,
      primeraFactura: 0,
      ultimaFactura: 0,
      totalNeto: 0,
      totalServicio: 0,
      ingresoReal: 0,
    },
    historial,
    diaCerrado: resumen?.yaCerrado ?? false,
    anulados: resumen?.anulados ?? [],
    cerrarCaja,
    recargarResumen: cargar,
  }
}