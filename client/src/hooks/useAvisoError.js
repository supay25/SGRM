import { useCallback } from 'react'
import { useToast } from '../components/Toast'

/**
 * Mismo patrón que [useAvisoImpresion]: un único lugar donde se decide cómo se
 * muestra un error de API. El backend manda el detalle en `response.data.error`;
 * si no vino nada usable, cae al mensaje genérico de quien llama.
 */
export default function useAvisoError() {
  const mostrarToast = useToast()

  return useCallback(
    (error, mensajePorDefecto) =>
      mostrarToast(error?.response?.data?.error || mensajePorDefecto, 'error'),
    [mostrarToast]
  )
}
