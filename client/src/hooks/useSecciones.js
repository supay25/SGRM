import { useCallback, useEffect, useState } from 'react'
import {
  getSecciones,
  crearSeccionRequest,
  actualizarSeccionRequest,
  eliminarSeccionRequest,
} from '../api/secciones.api.js'

export default function useSecciones() {
  const [secciones, setSecciones] = useState([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    try {
      const data = await getSecciones()
      setSecciones(
        data.map((seccion) => ({
          ...seccion,
          porcentajeServicio: seccion.porcentajeServicio != null ? Number(seccion.porcentajeServicio) : 0,
          porcentajeComision: seccion.porcentajeComision != null ? Number(seccion.porcentajeComision) : 0,
        }))
      )
    } catch (error) {
      console.error('Error al cargar las secciones:', error)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const agregarSeccion = useCallback(async (datos) => {
    await crearSeccionRequest(datos)
    await cargar()
  }, [cargar])

  const actualizarSeccion = useCallback(async (id, datos) => {
    await actualizarSeccionRequest(id, datos)
    await cargar()
  }, [cargar])

  const eliminarSeccion = useCallback(async (id) => {
    await eliminarSeccionRequest(id)
    await cargar()
  }, [cargar])

  return { secciones, cargando, agregarSeccion, actualizarSeccion, eliminarSeccion }
}