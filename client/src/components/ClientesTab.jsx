import { useState } from 'react'
import ClienteFormModal from './ClienteFormModal'
import useClientes from '../hooks/useClientes'

export default function ClientesTab() {
  const { clientes, cargando, agregarCliente, actualizarCliente, eliminarCliente } = useClientes()

  const [modalCliente, setModalCliente] = useState(null) // null | 'nuevo' | cliente
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState('')

  const termino = busqueda.trim().toLowerCase()
  const clientesFiltrados = termino
    ? clientes.filter((cliente) => cliente.nombre.toLowerCase().includes(termino))
    : clientes

  async function handleGuardarCliente(nombre) {
    if (modalCliente && modalCliente !== 'nuevo') {
      await actualizarCliente(modalCliente.id, nombre)
    } else {
      await agregarCliente(nombre)
    }
    setModalCliente(null)
  }

  async function handleEliminarCliente(cliente) {
    // TODO: reemplazar por confirmación propia del sistema de diseño
    const confirmado = window.confirm(
      `¿Eliminar al cliente "${cliente.nombre}"? Esta acción no se puede deshacer.`
    )
    if (!confirmado) return

    setError('')
    try {
      await eliminarCliente(cliente.id)
    } catch (error) {
      setError(error.response?.data?.error || 'Error al eliminar el cliente')
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted">
          Administra los clientes que puedes asignar a las facturas.
        </p>
        <button
          type="button"
          onClick={() => setModalCliente('nuevo')}
          className="rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark active:scale-[0.98]"
        >
          + Nuevo cliente
        </button>
      </div>

      <div className="mt-4">
        <input
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar cliente por nombre..."
          className="
            w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 sm:max-w-xs
            text-sm text-ink placeholder-muted transition
            focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ember/60
          "
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {cargando ? (
        <div className="py-16 text-center text-sm text-muted">Cargando clientes...</div>
      ) : clientes.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line py-20 text-center">
          <span className="mb-3 block text-4xl">🧾</span>
          <p className="text-sm text-muted">Todavía no hay clientes registrados.</p>
          <p className="mt-1 text-sm text-muted">
            Crea el primero con el botón «+ Nuevo cliente».
          </p>
        </div>
      ) : clientesFiltrados.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line py-20 text-center">
          <span className="mb-3 block text-4xl">🔍</span>
          <p className="text-sm text-muted">
            Ningún cliente coincide con «{busqueda.trim()}».
          </p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {clientesFiltrados.map((cliente) => (
            <div
              key={cliente.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <h3 className="min-w-0 flex-1 truncate text-base font-medium text-ink">
                {cliente.nombre}
              </h3>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setModalCliente(cliente)}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition hover:border-ember/50 hover:text-ember"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleEliminarCliente(cliente)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger/10"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalCliente !== null && (
        <ClienteFormModal
          cliente={modalCliente === 'nuevo' ? null : modalCliente}
          onCerrar={() => setModalCliente(null)}
          onGuardar={handleGuardarCliente}
        />
      )}
    </>
  )
}
