import { useCallback, useEffect, useState } from 'react'
import {
  getOwnersRequest,
  crearOwnerRequest,
  crearRestauranteRequest,
} from '../api/admin.api.js'

// Hook de la página "Agregar": trae los owners para el select y da de alta cuentas
export default function useAdminAlta() {
  const [owners, setOwners] = useState([])
  const [cargandoOwners, setCargandoOwners] = useState(true)
  const [errorOwners, setErrorOwners] = useState('')

  const recargarOwners = useCallback(async () => {
    try {
      const datos = await getOwnersRequest()
      setOwners(datos)
      setErrorOwners('')
    } catch (err) {
      setErrorOwners(err.response?.data?.error || 'Error al cargar los clientes')
    }
  }, [])

  useEffect(() => {
    const cargar = async () => {
      await recargarOwners()
      setCargandoOwners(false)
    }
    cargar()
  }, [recargarOwners])

  // Los errores se propagan a propósito: cada formulario los muestra en su tarjeta
  async function crearOwner(datos) {
    const nuevo = await crearOwnerRequest(datos)
    setOwners((previos) => [{ ...nuevo, _count: { restaurants: 0 } }, ...previos])
    return nuevo
  }

  async function crearRestaurante(datos) {
    const nuevo = await crearRestauranteRequest(datos)
    // El conteo de restaurantes del cliente cambió
    await recargarOwners()
    return nuevo
  }

  const ownersActivos = owners.filter((owner) => owner.isActive)

  return { owners, ownersActivos, cargandoOwners, errorOwners, crearOwner, crearRestaurante }
}
