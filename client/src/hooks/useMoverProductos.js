import { useCallback, useEffect, useMemo, useState } from 'react'
import { getOrdenDeMesa, moverProductosRequest } from '../api/ordenes.api'

// Los precios llegan como string (Decimal de Prisma) → Number() antes de operar.
const mapearItems = (orden) =>
  orden?.items?.map((item) => ({
    productoId: item.productoId,
    nombre: item.producto.nombre,
    precio: Number(item.precioUnitario),
    cantidad: item.cantidad,
  })) ?? []

const resumir = (items) =>
  items.reduce(
    (acc, item) => ({
      unidades: acc.unidades + item.cantidad,
      monto: acc.monto + item.precio * item.cantidad,
    }),
    { unidades: 0, monto: 0 }
  )

export default function useMoverProductos() {
  const [mesaOrigenId, setMesaOrigenId] = useState('')
  const [mesaDestinoId, setMesaDestinoId] = useState('')
  const [paneles, setPaneles] = useState({ origen: [], destino: [] })
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const ambasElegidas = Boolean(mesaOrigenId && mesaDestinoId && mesaOrigenId !== mesaDestinoId)


  useEffect(() => {
    if (!ambasElegidas) {
      setPaneles({ origen: [], destino: [] })
      return
    }

    let cancelado = false

    const cargar = async () => {
      setCargando(true)
      setError('')
      try {
        const [ordenOrigen, ordenDestino] = await Promise.all([
          getOrdenDeMesa(mesaOrigenId),
          getOrdenDeMesa(mesaDestinoId),
        ])
        if (cancelado) return
        setPaneles({ origen: mapearItems(ordenOrigen), destino: mapearItems(ordenDestino) })
      } catch (err) {
        if (cancelado) return
        setPaneles({ origen: [], destino: [] })
        setError(err.response?.data?.error || 'Error al cargar los productos de las mesas')
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    cargar()
    return () => {
      cancelado = true
    }
  }, [ambasElegidas, mesaOrigenId, mesaDestinoId])

  /**
   * Mueve un producto de un panel al otro.
   * @param desde 'origen' | 'destino'
   * @param todo  true = mueve toda la cantidad; false = solo 1 unidad
   */
  const moverItem = useCallback((desde, productoId, todo = false) => {
    setPaneles((prev) => {
      const hacia = desde === 'origen' ? 'destino' : 'origen'
      const item = prev[desde].find((linea) => linea.productoId === productoId)
      if (!item) return prev

      const cantidad = todo ? item.cantidad : 1

      // Si la línea queda en 0 desaparece del panel.
      const listaDesde = prev[desde]
        .map((linea) =>
          linea.productoId === productoId ? { ...linea, cantidad: linea.cantidad - cantidad } : linea
        )
        .filter((linea) => linea.cantidad > 0)

      // Si el producto ya estaba del otro lado, se suman las cantidades.
      const yaExiste = prev[hacia].some((linea) => linea.productoId === productoId)
      const listaHacia = yaExiste
        ? prev[hacia].map((linea) =>
            linea.productoId === productoId ? { ...linea, cantidad: linea.cantidad + cantidad } : linea
          )
        : [...prev[hacia], { ...item, cantidad }]

      return { [desde]: listaDesde, [hacia]: listaHacia }
    })
  }, [])

  const resumenOrigen = useMemo(() => resumir(paneles.origen), [paneles.origen])
  const resumenDestino = useMemo(() => resumir(paneles.destino), [paneles.destino])

  const confirmar = useCallback(async () => {
    if (!ambasElegidas) return false

    setGuardando(true)
    setError('')
    try {
      await moverProductosRequest({
        mesaOrigenId: Number(mesaOrigenId),
        mesaDestinoId: Number(mesaDestinoId),
        itemsOrigen: paneles.origen.map((linea) => ({
          productoId: linea.productoId,
          cantidad: linea.cantidad,
        })),
        itemsDestino: paneles.destino.map((linea) => ({
          productoId: linea.productoId,
          cantidad: linea.cantidad,
        })),
      })
      return true
    } catch (err) {
      setError(err.response?.data?.error || 'Error al mover los productos')
      return false
    } finally {
      setGuardando(false)
    }
  }, [ambasElegidas, mesaOrigenId, mesaDestinoId, paneles])

  return {
    mesaOrigenId,
    setMesaOrigenId,
    mesaDestinoId,
    setMesaDestinoId,
    itemsOrigen: paneles.origen,
    itemsDestino: paneles.destino,
    resumenOrigen,
    resumenDestino,
    ambasElegidas,
    cargando,
    guardando,
    error,
    moverItem,
    confirmar,
  }
}
