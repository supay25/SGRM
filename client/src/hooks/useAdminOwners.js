import { useCallback, useEffect, useState } from 'react'
import { getOwnersRequest, toggleOwnerActivoRequest } from '../api/admin.api.js'

export default function useAdminOwners() {
  const [owners, setOwners] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [idEnProceso, setIdEnProceso] = useState(null)

  const recargar = useCallback(async () => {
    try {
      const datos = await getOwnersRequest()
      setOwners(datos)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar los clientes')
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
      const actualizado = await toggleOwnerActivoRequest(id)
      setOwners((previos) =>
        previos.map((owner) =>
          owner.id === id ? { ...owner, isActive: actualizado.isActive } : owner
        )
      )
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar el estado del cliente')
    } finally {
      setIdEnProceso(null)
    }
  }

  const activos = owners.filter((owner) => owner.isActive)
  const inactivos = owners.filter((owner) => !owner.isActive)

  return { owners, activos, inactivos, cargando, error, idEnProceso, toggleActivo, recargar }
}
