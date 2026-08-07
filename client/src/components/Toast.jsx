import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'


const ToastContext = createContext(null)

const DURACION_MS = 2600

// Los errores se leen más despacio y conviene que aguanten un poco más.
const DURACION_ERROR_MS = 4200

const ESTILOS_POR_TIPO = {
  info: {
    caja: 'border-line-strong bg-surface-2',
    icono: 'text-ember-light',
    trazo: 'M12 11v5M12 7.5h.01',
  },
  success: {
    caja: 'border-success/50 bg-surface-2',
    icono: 'text-success',
    trazo: 'm8 12.5 2.5 2.5L16 9.5',
  },
  error: {
    caja: 'border-danger/50 bg-surface-2',
    icono: 'text-danger',
    trazo: 'M12 7.5v5M12 16h.01',
  },
}

export function ToastProvider({ children }) {
  const [avisos, setAvisos] = useState([])
  const siguienteId = useRef(0)

  const quitarAviso = useCallback((id) => {
    setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id))
  }, [])

  // Estable: los componentes pueden guardarlo en dependencias sin re-render extra.
  const mostrarToast = useCallback((mensaje, tipo = 'info') => {
    const id = siguienteId.current
    siguienteId.current += 1
    setAvisos((actuales) => [...actuales, { id, mensaje, tipo }])
  }, [])

  return (
    <ToastContext.Provider value={mostrarToast}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-100 flex flex-col items-center gap-2 px-4"
      >
        {avisos.map((aviso) => (
          <ToastAviso key={aviso.id} aviso={aviso} onExpirar={quitarAviso} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastAviso({ aviso, onExpirar }) {
  const estilos = ESTILOS_POR_TIPO[aviso.tipo] ?? ESTILOS_POR_TIPO.info

  useEffect(() => {
    const duracion = aviso.tipo === 'error' ? DURACION_ERROR_MS : DURACION_MS
    const temporizador = setTimeout(() => onExpirar(aviso.id), duracion)
    return () => clearTimeout(temporizador)
  }, [aviso.id, aviso.tipo, onExpirar])

  return (
    <div
      role="status"
      className={`
        animacion-toast flex max-w-sm items-center gap-2.5 rounded-xl border px-4 py-3
        text-sm font-semibold text-ink shadow-2xl shadow-stone-950/50
        ${estilos.caja}
      `}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4.5 w-4.5 shrink-0 ${estilos.icono}`}
      >
        <circle cx="12" cy="12" r="9" />
        <path d={estilos.trazo} />
      </svg>
      {aviso.mensaje}
    </div>
  )
}

/**
 * Devuelve `mostrarToast(mensaje, tipo)`. El tipo es opcional:
 * 'info' (por defecto) | 'success' | 'error'.
 */
export function useToast() {
  const mostrarToast = useContext(ToastContext)
  if (!mostrarToast) {
    throw new Error('useToast debe usarse dentro de <ToastProvider>')
  }
  return mostrarToast
}
