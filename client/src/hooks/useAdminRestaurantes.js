import { useCallback, useEffect, useState } from 'react'
import { getRestaurantesAdminRequest, toggleRestauranteActivoRequest } from '../api/admin.api.js'

export default function useAdminRestaurantes() {
  const [restaurantes, setRestaurantes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [idEnProceso, setIdEnProceso] = useState(null)

  const recargar = useCallback(async () => {
    try {
      const datos = await getRestaurantesAdminRequest()
      setRestaurantes(datos)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar los restaurantes')
    }
  }, [])

  useEffect(() => {
    const cargar = async () => {
      await recargar()
      setCargando(false)
    }
    cargar()
  }, [recargar])

  async function toggleActivo(id) {
    setIdEnProceso(id)
    setError('')
    try {
      const actualizado = await toggleRestauranteActivoRequest(id)
      setRestaurantes((previos) =>
        previos.map((restaurante) =>
          restaurante.id === id
            ? { ...restaurante, isActive: actualizado.isActive }
            : restaurante
        )
      )
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar el estado del restaurante')
    } finally {
      setIdEnProceso(null)
    }
  }

  return { restaurantes, cargando, error, idEnProceso, toggleActivo, recargar }
}
