import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFacturasRequest, getFacturaDetalleRequest, anularFacturaRequest } from '../api/facturas.api.js'

export default function useFacturas() {
  const [facturas, setFacturas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [facturaSeleccionadaId, setFacturaSeleccionadaId] = useState(null)
  const [itemsSeleccionados, setItemsSeleccionados] = useState([])
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {

        const facturaData = await getFacturasRequest()
        setFacturas(facturaData)
      } catch (error) {
        console.error('Error al cargar las facturas:', error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const facturasOrdenadas = useMemo(
    () =>
      [...facturas]
        .sort((a, b) => b.numeroFactura - a.numeroFactura)
        .map((factura) => ({
          ...factura,
          nombreSeccion: factura.seccion?.nombreSeccion ?? 'Sección',
        })),
    [facturas]
  )

  const resumenDelDia = useMemo(() => {
    const activas = facturas.filter((factura) => !factura.anulada)
    const totalNeto = activas.reduce((acc, factura) => acc + Number(factura.montoNeto), 0)
    const totalServicio = activas.reduce((acc, factura) => acc + Number(factura.montoServicio), 0)
    const totalComision = activas.reduce((acc, factura) => acc + Number(factura.montoComision), 0)
    return { cantidad: facturas.length, totalNeto, totalServicio, totalComision }
  }, [facturas])

  const detalle = useMemo(() => {
    const factura = facturasOrdenadas.find((f) => f.id === facturaSeleccionadaId)
    if (!factura) return null
    return { ...factura, items: itemsSeleccionados }
  }, [facturasOrdenadas, facturaSeleccionadaId, itemsSeleccionados])

  const seleccionarFactura = useCallback(async (facturaId) => {
    setFacturaSeleccionadaId(facturaId)
    setCargandoDetalle(true)
    try {
      const facturaData = await getFacturasRequest()
      setFacturas(facturaData)
    } catch (error) {
      console.error('Error al cargar el detalle de la factura:', error)
    } finally {
      setCargandoDetalle(false)
    }
  }, [])

  const cerrarDetalle = useCallback(() => {
    setFacturaSeleccionadaId(null)
    setItemsSeleccionados([])
  }, [])

  const anularFactura = useCallback(async (facturaId) => {
    try {
      await anularFacturaRequest(facturaId)
      const facturaData = await getFacturasRequest()
      setFacturas(facturaData)
    } catch (error) {
      alert(error.response?.data?.error || 'Error al anular la factura')
    }
  }, [])

  return {
    cargando,
    facturas: facturasOrdenadas,
    resumenDelDia,
    facturaSeleccionadaId,
    detalle,
    cargandoDetalle,
    seleccionarFactura,
    cerrarDetalle,
    anularFactura,
  }
}
