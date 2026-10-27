import { useCallback } from 'react'
import { getConfigRequest } from '../api/restaurante.api.js'
import { construirTicketFactura } from '../utils/ticketFactura.js'
import { useToast } from '../components/Toast'

/**
 * Impresión de facturas en la térmica de 80 mm.
 *
 * Va por el diálogo de impresión del navegador: la impresora está instalada en
 * Windows con su driver, así que alcanza con mandarle un HTML del ancho correcto.
 * El ticket se arma en un iframe aparte para que no se cuele nada de la app
 * (modales, overlays, Tailwind) en el papel.
 */

// Los datos del negocio no cambian durante la sesión: se piden una sola vez.
// Si la petición falla no se cachea nada, para que el siguiente intento reintente.
let negocioEnCache = null

async function cargarNegocio() {
  if (!negocioEnCache) negocioEnCache = await getConfigRequest()
  return negocioEnCache
}

function imprimirDocumento(html) {
  const marco = document.createElement('iframe')
  marco.setAttribute('aria-hidden', 'true')
  marco.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden'

  marco.onload = () => {
    const ventana = marco.contentWindow

    // Un iframe recién insertado dispara un `load` de about:blank antes de cargar
    // el srcdoc. Sin esta guarda ese primer load mandaría una página vacía al papel.
    if (!ventana?.document?.querySelector('.ticket')) return

    // El iframe no se puede quitar mientras el diálogo está abierto: lo cancelaría.
    const limpiar = () => marco.remove()
    ventana.onafterprint = limpiar
    // Red de seguridad por si el navegador nunca dispara afterprint.
    setTimeout(limpiar, 60000)

    ventana.focus()
    ventana.print()
  }

  // El srcdoc va antes de insertarlo: así la única navegación es la del ticket.
  marco.srcdoc = html
  document.body.appendChild(marco)
}

/**
 * `negocioExterno` es para las pantallas del owner, que leen el restaurante por
 * su propio endpoint y no tienen permiso sobre /restaurante/config.
 */
export default function useImprimirFactura(negocioExterno = null) {
  const mostrarToast = useToast()

  return useCallback(
    async (factura) => {
      if (!factura) return

      let negocio = negocioExterno
      if (!negocio) {
        try {
          negocio = await cargarNegocio()
        } catch (error) {
          // Sin encabezado la factura sigue siendo útil: se imprime igual.
          console.error('No se pudieron cargar los datos del negocio:', error)
        }
      }

      try {
        imprimirDocumento(construirTicketFactura(factura, negocio))
      } catch (error) {
        console.error('Error al imprimir la factura:', error)
        mostrarToast('No se pudo abrir la impresión', 'error')
      }
    },
    [negocioExterno, mostrarToast]
  )
}
