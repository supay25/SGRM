import { useCallback, useState } from 'react'

// Paleta de identificación visual por sección: tonos apagados y fríos,
// pensados para no competir con el acento primario "ember" ni verse
// "chillantes" sobre el fondo oscuro. Se asigna en el frontend recorriendo
// este arreglo en orden; si el backend llega a exponer un color propio por
// sección, esta paleta puede eliminarse y leerse desde ahí.
const PALETA_SECCIONES = [
  {
    texto: 'text-sky-300',
    suave: 'bg-sky-400/10 text-sky-300 border-sky-400/25',
    solido: 'bg-sky-400/80',
  },
  {
    texto: 'text-violet-300',
    suave: 'bg-violet-400/10 text-violet-300 border-violet-400/25',
    solido: 'bg-violet-400/80',
  },
  {
    texto: 'text-teal-300',
    suave: 'bg-teal-400/10 text-teal-300 border-teal-400/25',
    solido: 'bg-teal-400/80',
  },
  {
    texto: 'text-cyan-300',
    suave: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/25',
    solido: 'bg-cyan-400/80',
  },
]

// TODO: reemplazar por GET /api/secciones
const SECCIONES_MOCK = [
  { id: 'salon', nombre: 'Salón' },
  { id: 'llevar', nombre: 'Para Llevar' },
  { id: 'uber', nombre: 'Uber' },
].map((seccion, index) => ({
  ...seccion,
  colores: PALETA_SECCIONES[index % PALETA_SECCIONES.length],
}))

// TODO: reemplazar por GET /api/mesas
const MESAS_MOCK = [
  { id: 1, nombre: 'Mesa 1', seccionId: 'salon', estado: 'OCUPADA' },
  { id: 2, nombre: 'Mesa 2', seccionId: 'salon', estado: 'LIBRE' },
  { id: 3, nombre: 'Mesa 3', seccionId: 'salon', estado: 'LIBRE' },
  { id: 4, nombre: 'Mesa 4', seccionId: 'salon', estado: 'OCUPADA' },
  { id: 5, nombre: 'Pedido #12', seccionId: 'llevar', estado: 'OCUPADA' },
  { id: 6, nombre: 'Pedido #13', seccionId: 'llevar', estado: 'LIBRE' },
  { id: 7, nombre: 'Uber #4521', seccionId: 'uber', estado: 'OCUPADA' },
]

/**
 * Encapsula el estado de mesas/secciones y las operaciones que las modifican.
 * Hoy trabaja sobre datos en memoria; al conectar el backend, solo hay que
 * reemplazar el cuerpo de cada función (fetchMesas/agregarMesa/etc.) por
 * llamadas a axiosClient, manteniendo la misma forma de retorno.
 */
export default function useMesas() {
  const [secciones] = useState(SECCIONES_MOCK)
  const [mesas, setMesas] = useState(MESAS_MOCK)

  const agregarMesa = useCallback(({ nombre, seccionId }) => {
    // TODO: reemplazar por POST /api/mesas { nombre, seccionId }
    setMesas((prev) => [
      ...prev,
      { id: Date.now(), nombre, seccionId, estado: 'LIBRE' },
    ])
  }, [])

  const actualizarMesa = useCallback((id, cambios) => {
    // TODO: reemplazar por PATCH /api/mesas/:id
    setMesas((prev) =>
      prev.map((mesa) => (mesa.id === id ? { ...mesa, ...cambios } : mesa))
    )
  }, [])

  const eliminarMesa = useCallback((id) => {
    // TODO: reemplazar por DELETE /api/mesas/:id
    setMesas((prev) => prev.filter((mesa) => mesa.id !== id))
  }, [])

  return { secciones, mesas, agregarMesa, actualizarMesa, eliminarMesa }
}
