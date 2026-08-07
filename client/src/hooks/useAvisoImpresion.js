import { useCallback } from 'react'
import { useToast } from '../components/Toast'

export const MENSAJE_IMPRESION_PENDIENTE = 'Impresión próximamente disponible'

/**
 * La impresión térmica todavía no existe. Mientras tanto, todos los botones
 * "Imprimir" avisan lo mismo desde acá: un único punto que cambiar el día que
 * se implemente de verdad.
 */
export default function useAvisoImpresion() {
  const mostrarToast = useToast()

  return useCallback(() => mostrarToast(MENSAJE_IMPRESION_PENDIENTE), [mostrarToast])
}
