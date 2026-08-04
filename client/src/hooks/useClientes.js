import { useCallback, useEffect, useState } from 'react'
import {
  getClientesRequest,
  crearClienteRequest,
  actualizarClienteRequest,
  eliminarClienteRequest,
} from '../api/cliente.api.js'

export default function useClientes() {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    try {
      const data = await getClientesRequest()
      setClientes(data)
    } catch (error) {
      console.error('Error al cargar los clientes:', error)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  // Los errores suben al componente para mostrarlos en el formulario / la lista.
  const agregarCliente = useCallback(async (nombre) => {
    await crearClienteRequest(nombre)
    await cargar()
  }, [cargar])

  const actualizarCliente = useCallback(async (id, nombre) => {
    await actualizarClienteRequest(id, nombre)
    await cargar()
  }, [cargar])

  const eliminarCliente = useCallback(async (id) => {
    await eliminarClienteRequest(id)
    await cargar()
  }, [cargar])

  return { clientes, cargando, agregarCliente, actualizarCliente, eliminarCliente }
}
