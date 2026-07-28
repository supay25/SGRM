import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCategoriasRequest, crearCategoriaRequest, actualizarCategoriaRequest, eliminarCategoriaRequest } from '../api/categorias.api.js'
import { getProductos, crearProductoRequest, actualizarProductoRequest, eliminarProductoRequest } from '../api/productos.api.js'

export default function useMenu() {
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [categoriaActivaId, setCategoriaActivaId] = useState(null)

  const cargar = useCallback(async () => {
    try {
      const [categoriasData, productosData] = await Promise.all([
        getCategoriasRequest(),
        getProductos(),
      ])
      setCategorias(categoriasData)
      setProductos(productosData)
    } catch (error) {
      console.error('Error al cargar el menú:', error)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const productosFiltrados = useMemo(() => {
    if (categoriaActivaId === null) return productos
    return productos.filter((p) => p.categoriaId === categoriaActivaId)
  }, [productos, categoriaActivaId])

  const agregarCategoria = useCallback(async (nombre) => {
    await crearCategoriaRequest({ nombre })
    await cargar()
  }, [cargar])

  const actualizarCategoria = useCallback(async (id, nombre) => {
    await actualizarCategoriaRequest(id, { nombre })
    await cargar()
  }, [cargar])

  const eliminarCategoria = useCallback(async (id) => {
    await eliminarCategoriaRequest(id)
    setCategoriaActivaId((prev) => (prev === id ? null : prev))
    await cargar()
  }, [cargar])

  const agregarProducto = useCallback(async (datos) => {
    await crearProductoRequest(datos)
    await cargar()
  }, [cargar])

  const actualizarProducto = useCallback(async (id, datos) => {
    await actualizarProductoRequest(id, datos)
    await cargar()
  }, [cargar])

  const eliminarProducto = useCallback(async (id) => {
    await eliminarProductoRequest(id)
    await cargar()
  }, [cargar])

  return {
    cargando,
    categorias,
    productosFiltrados,
    categoriaActivaId,
    setCategoriaActivaId,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
  }
}