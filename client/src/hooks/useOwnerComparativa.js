import { useEffect, useState } from 'react'
import { getComparativaRequest } from '../api/owner.api'
import { rangoUltimos30Dias } from '../utils/fechas'

export default function useOwnerComparativa() {
  // Al entrar se compara el rango por defecto: los últimos 30 días.
  const [rango, setRango] = useState(rangoUltimos30Dias)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [restaurantes, setRestaurantes] = useState([])

  useEffect(() => {
    let activo = true
    const cargar = async () => {
      setCargando(true)
      setError('')
      try {
        const data = await getComparativaRequest(rango.desde, rango.hasta)
        if (!activo) return
        // Los montos vienen como string (Prisma Decimal): se convierten a número una sola vez acá.
        setRestaurantes(
          data.map((item) => ({
            restauranteId: item.restauranteId,
            nombre: item.nombre,
            cantidadFacturas: item.cantidadFacturas,
            ingresoReal: Number(item.ingresoReal),
            totalNeto: Number(item.totalNeto),
            totalServicio: Number(item.totalServicio),
          }))
        )
      } catch (err) {
        if (!activo) return
        setError(err.response?.data?.error || 'Error al cargar la comparativa de restaurantes')
        setRestaurantes([])
      } finally {
        if (activo) setCargando(false)
      }
    }
    cargar()
    return () => {
      activo = false
    }
  }, [rango.desde, rango.hasta])

  const aplicarRango = (desde, hasta) => {
    if (!desde || !hasta) return
    if (desde > hasta) {
      setError('La fecha "Desde" no puede ser mayor que la fecha "Hasta".')
      return
    }
    setRango({ desde, hasta })
  }

  return {
    rango,
    cargando,
    error,
    restaurantes,
    aplicarRango,
  }
}
