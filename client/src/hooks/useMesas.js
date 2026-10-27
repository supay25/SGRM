import { useCallback, useEffect, useState } from 'react'
import { getSecciones } from '../api/secciones.api.js'
import { getMesas, actualizarMesaRequest, eliminarMesaRequest, crearMesaRequest } from '../api/mesas.api.js'
import useAvisoError from './useAvisoError.js'

// Sobre fondo claro los tonos -300 desaparecían: `texto` usa la variante -700
// (4.5:1 o mejor sobre blanco y sobre surface-2) y `solido` la -600, que llega al
// 3:1 exigido a elementos gráficos como el punto y la franja de la tarjeta.
// Los cuatro tonos se separan también en luminancia, no solo en matiz.
const PALETA_SECCIONES = [
  {
    texto: 'text-sky-700',
    suave: 'bg-sky-600/10 text-sky-700 border-sky-600/30',
    solido: 'bg-sky-600',
  },
  {
    texto: 'text-violet-700',
    suave: 'bg-violet-600/10 text-violet-700 border-violet-600/30',
    solido: 'bg-violet-600',
  },
  {
    texto: 'text-teal-700',
    suave: 'bg-teal-600/10 text-teal-700 border-teal-600/30',
    solido: 'bg-teal-600',
  },
  {
    texto: 'text-fuchsia-700',
    suave: 'bg-fuchsia-600/10 text-fuchsia-700 border-fuchsia-600/30',
    solido: 'bg-fuchsia-600',
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