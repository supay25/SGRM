import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFacturasRequest, getFacturaDetalleRequest, anularFacturaRequest } from '../api/facturas.api.js'
import { editarClienteFacturaRequest } from '../api/cliente.api.js'

export default function useFacturas() {
  const [facturas, setFacturas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [facturaSeleccionadaId, setFacturaSeleccionadaId] = useState(null)
  const [detalle, setDetalle] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  const cargarFacturas = useCallback(async () => {
    try {
      const facturaData = await getFacturasRequest()
      setFacturas(facturaData)
    } catch (error) {
      console.error('Error al cargar las facturas:', error)
    }
  }, [])

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      await cargarFacturas()
      setCargando(false)
    }
    cargar()
  }, [cargarFacturas])

  const facturasOrdenadas = useMemo(
    () =>
      [...facturas]
        .sort((a, b) => b.numeroFactura - a.numeroFactura)
        .map((factura) => ({
          ...factura,
          nombreSeccion: factura.seccion?.nombre ?? 'Sección',
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

  const cargarDetalle = useCallback(async (facturaId) => {
    setCargandoDetalle(true)
    try {
      const facturaData = await getFacturaDetalleRequest(facturaId)
      setDetalle({ ...facturaData, nombreSeccion: facturaData.seccion?.nombre ?? 'Sección' })
    } catch (error) {
      console.error('Error al cargar el detalle de la factura:', error)
    } finally {
      setCargandoDetalle(false)
    }
  }, [])

  const seleccionarFactura = useCallback(
    async (facturaId) => {
      setFacturaSeleccionadaId(facturaId)
      await cargarDetalle(facturaId)
    },
    [cargarDetalle]
  )

  const cerrarDetalle = useCallback(() => {
    setFacturaSeleccionadaId(null)
    setDetalle(null)
  }, [])

  const anularFactura = useCallback(
    async (facturaId) => {
      try {
        await anularFacturaRequest(facturaId)
        await cargarFacturas()
        if (facturaId === facturaSeleccionadaId) await cargarDetalle(facturaId)
      } catch (error) {
        alert(error.response?.data?.error || 'Error al anular la factura')
      }
    },
    [cargarFacturas, cargarDetalle, facturaSeleccionadaId]
  )

  const editarCliente = useCallback(
    async (facturaId, nombreCliente) => {
      try {
        await editarClienteFacturaRequest(facturaId, nombreCliente)
        await cargarFacturas()
        if (facturaId === facturaSeleccionadaId) await cargarDetalle(facturaId)
      } catch (error) {
        alert(error.response?.data?.error || 'Error al editar el cliente')
      }
    },
    [cargarFacturas, cargarDetalle, facturaSeleccionadaId]
  )

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
    editarCliente,
  }
}
