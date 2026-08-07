import { useCallback, useEffect, useState } from 'react'
import { getSecciones } from '../api/secciones.api.js'
import { getMesas, actualizarMesaRequest, eliminarMesaRequest, crearMesaRequest } from '../api/mesas.api.js'
import useAvisoError from './useAvisoError.js'

// `solido` va a opacidad plena para que el punto de color de cada sección
// se distinga bien sobre el fondo oscuro.
const PALETA_SECCIONES = [
  {
    texto: 'text-sky-300',
    suave: 'bg-sky-400/10 text-sky-300 border-sky-400/25',
    solido: 'bg-sky-400',
  },
  {
    texto: 'text-violet-300',
    suave: 'bg-violet-400/10 text-violet-300 border-violet-400/25',
    solido: 'bg-violet-400',
  },
  {
    texto: 'text-teal-300',
    suave: 'bg-teal-400/10 text-teal-300 border-teal-400/25',
    solido: 'bg-teal-400',
  },
  {
    texto: 'text-cyan-300',
    suave: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/25',
    solido: 'bg-cyan-400',
  },
]


export default function useMesas() {

  const avisarError = useAvisoError()
  const [secciones, setSecciones] = useState([])
  const [mesas, setMesas] = useState([])
  const [cargando, setCargando] = useState(true)


  const cargar = useCallback(async () =>{
    try {
      const [seccionData, mesasData] = await Promise.all([
        getSecciones(),
        getMesas(),
      ])

      setSecciones(
        seccionData.map((seccion, index) => ({
          ...seccion,
          colores: PALETA_SECCIONES[index % PALETA_SECCIONES.length],
        }))
      )
      setMesas(mesasData)

    } catch (error) {
      console.error('Error al cargar mesas y secciones:', error)
    } finally {
      setCargando(false)
    }
  }, [])

useEffect(() => {
    cargar()
  }, [cargar])



 const agregarMesa = useCallback(async ({ nombre, seccionId }) => {
    try {
      await crearMesaRequest({ nombre, seccionId })
      await cargar()
    } catch (error) {
      avisarError(error, 'Error al crear la mesa')
    }
  }, [cargar, avisarError])

  const actualizarMesa = useCallback(async (id, cambios) => {
    try {
      await actualizarMesaRequest(id, cambios)
      await cargar()
    } catch (error) {
      avisarError(error, 'Error al actualizar la mesa')
    }
  }, [cargar, avisarError])

  const eliminarMesa = useCallback(async (id) => {
    try {
      await eliminarMesaRequest(id)
      await cargar()
    } catch (error) {
      avisarError(error, 'Error al eliminar la mesa')
    }
  }, [cargar, avisarError])

  return { secciones, mesas, cargando, recargar: cargar, agregarMesa, actualizarMesa, eliminarMesa }
}