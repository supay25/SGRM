import { useEffect, useState } from 'react'
import BotonCerrarX from './BotonCerrarX'
import useClientes from '../hooks/useClientes'

export const CLIENTE_POR_DEFECTO = 'Cliente al contado'

/**
 * Sub-modal compartido: confirmar factura (OrdenMesa), cierre de caja y reportes.
 * Con `permitirNombreLibre` el buscador también sirve para escribir un nombre que no está en la lista.
 */
export default function SeleccionarClienteModal({
  nombreSeleccionado,
  onSeleccionar,
  onCerrar,
  permitirNombreLibre = false,
}) {
  const { clientes, cargando } = useClientes()
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCerrar])

  const termino = busqueda.trim().toLowerCase()
  const clientesFiltrados = termino
    ? clientes.filter((cliente) => cliente.nombre.toLowerCase().includes(termino))
    : clientes

  const esContado = nombreSeleccionado === CLIENTE_POR_DEFECTO

  const nombreEscrito = busqueda.trim()
  const mostrarNombreLibre =
    permitirNombreLibre &&
    nombreEscrito !== '' &&
    !clientes.some((cliente) => cliente.nombre.toLowerCase() === termino)

  return (
    // z-60: este sub-modal se abre encima del modal de confirmar factura (z-50).
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm"
      onClick={onCerrar}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-sm flex-col rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Seleccionar cliente</h2>
          <BotonCerrarX onClick={onCerrar} />
        </div>

        <div className="shrink-0 px-6 pt-5">
          <input
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder={permitirNombreLibre ? 'Buscar o escribir un nombre...' : 'Buscar cliente...'}
            autoFocus
            className="
              w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5
              text-sm text-ink placeholder-muted transition
              focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ember/60
            "
          />

          {mostrarNombreLibre && (
            <button
              type="button"
              onClick={() => onSeleccionar(nombreEscrito)}
              className="mt-2 w-full truncate rounded-lg border border-ember px-4 py-2.5 text-left text-sm font-semibold text-ember transition hover:bg-ember/10"
            >
              Usar «{nombreEscrito}»
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <button
            type="button"
            onClick={() => onSeleccionar(CLIENTE_POR_DEFECTO)}
            className={`
              w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition
              ${
                esContado
                  ? 'border-ember/50 bg-ember/10 text-ember'
                  : 'border-line bg-surface-2/40 text-muted hover:border-ember/50 hover:text-ink'
              }
            `}
          >
            {CLIENTE_POR_DEFECTO}
            <span className="mt-0.5 block text-xs font-normal text-muted">Sin cliente asignado</span>
          </button>

          <div className="mt-4 border-t border-line pt-4">
            {cargando ? (
              <p className="py-8 text-center text-sm text-muted">Cargando clientes...</p>
            ) : clientes.length === 0 ? (
              <div className="py-8 text-center">
                <span className="mb-2 block text-3xl">👥</span>
                <p className="text-sm text-muted">No hay clientes.</p>
                <p className="mt-1 text-xs text-muted">Agrégalos desde Parámetros.</p>
              </div>
            ) : clientesFiltrados.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">
                Ningún cliente coincide con «{busqueda.trim()}».
              </p>
            ) : (
              <div className="space-y-2">
                {clientesFiltrados.map((cliente) => {
                  const activo = cliente.nombre === nombreSeleccionado
                  return (
                    <button
                      key={cliente.id}
                      type="button"
                      onClick={() => onSeleccionar(cliente.nombre)}
                      className={`
                        w-full truncate rounded-lg border px-4 py-3 text-left text-sm font-medium transition
                        ${
                          activo
                            ? 'border-ember/50 bg-ember/10 text-ember'
                            : 'border-line bg-surface-2/40 text-ink hover:border-ember/50 hover:text-ember'
                        }
                      `}
                    >
                      {cliente.nombre}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
