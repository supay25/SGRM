import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMesa } from '../api/mesas.api'
import { getProductos } from '../api/productos.api'
import { getOrdenDeMesa, ingresarOrdenRequest, reiniciarOrdenRequest } from '../api/ordenes.api'
import { crearFacturaRequest, facturarDivididoRequest } from '../api/facturas.api'
import useAvisoError from './useAvisoError'

export default function useOrdenMesa(mesaId) {
  const navigate = useNavigate()
  const avisarError = useAvisoError()
  const [mesa, setMesa] = useState(null)
  const [catalogo, setCatalogo] = useState([])
  const [categoriaActivaId, setCategoriaActivaId] = useState('todas')
  const [lineas, setLineas] = useState([])
  const [ordenGuardadaEnBackend, setOrdenGuardadaEnBackend] = useState(false)
  const [cargando, setCargando] = useState(true)

  const seccion = mesa?.seccion ?? null

  // Carga la orden guardada del backend al estado local (o vacío si no hay)
  const cargarOrden = useCallback(async () => {
    const ordenData = await getOrdenDeMesa(mesaId)
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
    } else {
      setLineas([])
      setOrdenGuardadaEnBackend(false)
    }
  }, [mesaId])

  useEffect(() => {
    const cargar = async () => {
      try {
        const [mesaData, productosData] = await Promise.all([
          getMesa(mesaId),
          getProductos(),
        ])
        setMesa(mesaData)
        setCatalogo(productosData)
        await cargarOrden()
      } catch (error) {
        console.error('Error al cargar la mesa:', error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [mesaId, cargarOrden])

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

  const total = useMemo(
    () => lineas.reduce((acc, linea) => acc + linea.precio * linea.cantidad, 0),
    [lineas]
  )

  const montoServicio = useMemo(
    () => (seccion?.aplicaServicio ? Math.round(total * (Number(seccion.porcentajeServicio) / 100)) : 0),
    [total, seccion]
  )

  const subtotal = total - montoServicio

  const ingresarOrden = useCallback(async () => {
    if (lineas.length === 0) return
    try {
      const items = lineas.map((l) => ({ productoId: l.productoId, cantidad: l.cantidad }))
      await ingresarOrdenRequest(mesaId, items)
      setOrdenGuardadaEnBackend(true)
      navigate('/home')
    } catch (error) {
      avisarError(error, 'Error al ingresar la orden')
    }
  }, [lineas, mesaId, navigate, avisarError])

  // Reiniciar: descarta cambios locales y vuelve al último estado guardado en el backend
  const reiniciar = useCallback(async () => {
    try {
      await cargarOrden()
    } catch (error) {
      avisarError(error, 'Error al reiniciar la orden')
    }
  }, [cargarOrden, avisarError])

  // Vaciar orden: el borrador quedó vacío y había orden guardada → borra la orden en el backend y libera la mesa
  const vaciarOrdenBackend = useCallback(async () => {
    try {
      await reiniciarOrdenRequest(mesaId)
      navigate('/home')
    } catch (error) {
      avisarError(error, 'Error al vaciar la orden')
    }
  }, [mesaId, navigate, avisarError])

  // true cuando el borrador quedó vacío PERO había orden guardada → toca vaciar en backend
  const debeVaciar = lineas.length === 0 && ordenGuardadaEnBackend

const facturar = useCallback(
  async (itemsAFacturar, descuento = 0, nombreCliente = 'Cliente al contado') => {
    
    if (!itemsAFacturar || itemsAFacturar.length === 0) {
      console.log('SALIO: items vacio')
      return
    }
    try {
      const items = itemsAFacturar.map((linea) => ({
        productoId: linea.productoId,
        cantidad: linea.cantidad,
      }))
      
      await facturarDivididoRequest(Number(mesaId), items, descuento, nombreCliente)
      navigate('/home')
    } catch (error) {
      console.log('ERROR EN CATCH:', error)
      avisarError(error, 'Error al facturar')
    }
  },
  [mesaId, navigate, avisarError]
)
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
    vaciarOrdenBackend,
    debeVaciar,
    facturar,
  }
}