import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMesa } from '../api/mesas.api'
import { getProductos } from '../api/productos.api'
import { getOrdenDeMesa, ingresarOrdenRequest, reiniciarOrdenRequest } from '../api/ordenes.api'
import { crearFacturaRequest } from '../api/facturas.api'

export default function useOrdenMesa(mesaId) {
  const navigate = useNavigate()
  const [mesa, setMesa] = useState(null)
  const [catalogo, setCatalogo] = useState([])
  const [categoriaActivaId, setCategoriaActivaId] = useState('todas')
  const [lineas, setLineas] = useState([])
  const [ordenGuardadaEnBackend, setOrdenGuardadaEnBackend] = useState(false)
  const [cargando, setCargando] = useState(true)

  const seccion = mesa?.seccion ?? null

  useEffect(() => {
    const cargar = async () => {
      try {
        const [mesaData, productosData, ordenData] = await Promise.all([
          getMesa(mesaId),
          getProductos(),
          getOrdenDeMesa(mesaId),
        ])
        setMesa(mesaData)
        setCatalogo(productosData)

        if (ordenData && ordenData.items?.length > 0) {
          setLineas(
            ordenData.items.map((item) => ({
              productoId: item.productoId,
              nombre: item.producto.nombre,
              precio: Number(item.precioUnitario),
              cantidad: item.cantidad,
            }))
          )
          setOrdenGuardadaEnBackend(true)
        }
      } catch (error) {
        console.error('Error al cargar la mesa:', error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [mesaId])

  const categorias = useMemo(() => {
    const vistas = new Map()
    catalogo.forEach((producto) => {
      if (!vistas.has(producto.categoria.id)) {
        vistas.set(producto.categoria.id, { id: producto.categoria.id, nombre: producto.categoria.nombre })
      }
    })
    return [{ id: 'todas', nombre: 'Todas' }, ...vistas.values()]
  }, [catalogo])

  const conteoPorCategoria = useMemo(() => {
    const conteo = { todas: catalogo.length }
    catalogo.forEach((producto) => {
      conteo[producto.categoria.id] = (conteo[producto.categoria.id] ?? 0) + 1
    })
    return conteo
  }, [catalogo])

  const productosFiltrados = useMemo(() => {
    if (categoriaActivaId === 'todas') return catalogo
    return catalogo.filter((producto) => producto.categoria.id === categoriaActivaId)
  }, [catalogo, categoriaActivaId])

  const cantidadesEnBorrador = useMemo(() => {
    const mapa = {}
    lineas.forEach((linea) => {
      mapa[linea.productoId] = linea.cantidad
    })
    return mapa
  }, [lineas])

  const agregarProducto = useCallback((producto) => {
    setLineas((prev) => {
      const existente = prev.find((linea) => linea.productoId === producto.id)
      if (existente) {
        return prev.map((linea) =>
          linea.productoId === producto.id ? { ...linea, cantidad: linea.cantidad + 1 } : linea
        )
      }
      return [
        ...prev,
        { productoId: producto.id, nombre: producto.nombre, precio: Number(producto.precio), cantidad: 1 },
      ]
    })
  }, [])

  const incrementarLinea = useCallback((productoId) => {
    setLineas((prev) =>
      prev.map((linea) => (linea.productoId === productoId ? { ...linea, cantidad: linea.cantidad + 1 } : linea))
    )
  }, [])

  const decrementarLinea = useCallback((productoId) => {
    setLineas((prev) =>
      prev
        .map((linea) => (linea.productoId === productoId ? { ...linea, cantidad: linea.cantidad - 1 } : linea))
        .filter((linea) => linea.cantidad > 0)
    )
  }, [])

  const eliminarLinea = useCallback((productoId) => {
    setLineas((prev) => prev.filter((linea) => linea.productoId !== productoId))
  }, [])


  const subtotal = useMemo(
    () => lineas.reduce((acc, linea) => acc + linea.precio * linea.cantidad, 0),
    [lineas]
  )
  const montoServicio = useMemo(
    () => (seccion?.aplicaServicio ? Math.round(subtotal * (Number(seccion.porcentajeServicio) / 100)) : 0),
    [subtotal, seccion]
  )
  const total = subtotal + montoServicio

  const ingresarOrden = useCallback(async () => {
    if (lineas.length === 0) return
    try {
      const items = lineas.map((l) => ({ productoId: l.productoId, cantidad: l.cantidad }))
      await ingresarOrdenRequest(mesaId, items)
      setOrdenGuardadaEnBackend(true)
      navigate('/home')
    } catch (error) {
      alert(error.response?.data?.error || 'Error al ingresar la orden')
    }
  }, [lineas, mesaId, navigate])

  const reiniciar = useCallback(async () => {
    if (ordenGuardadaEnBackend) {
      const confirmado = window.confirm('¿Seguro? Se perderá todo lo ingresado.')
      if (!confirmado) return
      try {
        await reiniciarOrdenRequest(mesaId)
        setOrdenGuardadaEnBackend(false)
      } catch (error) {
        alert(error.response?.data?.error || 'Error al reiniciar la orden')
        return
      }
    }
    setLineas([])
  }, [ordenGuardadaEnBackend, mesaId])

  const facturar = useCallback(async () => {
    if (lineas.length === 0) return
    try {
      await crearFacturaRequest(Number(mesaId))
      navigate('/home')
    } catch (error) {
      alert(error.response?.data?.error || 'Error al facturar')
    }
  }, [lineas, mesaId, navigate])

  return {
    mesa,
    seccion,
    cargando,
    categorias,
    categoriaActivaId,
    setCategoriaActivaId,
    conteoPorCategoria,
    productosFiltrados,
    lineas,
    cantidadesEnBorrador,
    agregarProducto,
    incrementarLinea,
    decrementarLinea,
    eliminarLinea,
    subtotal,
    montoServicio,
    total,
    ingresarOrden,
    reiniciar,
    facturar,
  }
}