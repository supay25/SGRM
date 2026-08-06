import { useState } from 'react'
import AdminNavbar from '../components/AdminNavbar'
import AdminOwnerCard from '../components/AdminOwnerCard'
import AdminRestauranteCard from '../components/AdminRestauranteCard'
import ConfirmarDesactivarModal from '../components/ConfirmarDesactivarModal'
import useAdminOwners from '../hooks/useAdminOwners'
import useAdminRestaurantes from '../hooks/useAdminRestaurantes'

function Seccion({ titulo, descripcion, cantidad, children }) {
  return (
    <section className="mt-8 first:mt-0">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-ink">{titulo}</h2>
          {descripcion && <p className="mt-0.5 text-sm text-muted">{descripcion}</p>}
        </div>
        {cantidad !== undefined && (
          <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-muted">
            {cantidad}
          </span>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Vacio({ icono, mensaje }) {
  return (
    <div className="rounded-xl border border-dashed border-line py-12 text-center">
      <span className="mb-2 block text-3xl">{icono}</span>
      <p className="text-sm text-muted">{mensaje}</p>
    </div>
  )
}

export default function AdminInicio() {
  const [confirmacion, setConfirmacion] = useState(null)

  const {
    activos: ownersActivos,
    inactivos: ownersInactivos,
    cargando: cargandoOwners,
    error: errorOwners,
    idEnProceso: ownerEnProceso,
    toggleActivo: toggleOwner,
  } = useAdminOwners()

  const {
    restaurantes,
    cargando: cargandoRestaurantes,
    error: errorRestaurantes,
    idEnProceso: restauranteEnProceso,
    toggleActivo: toggleRestaurante,
  } = useAdminRestaurantes()

  // Desactivar bloquea el inicio de sesión, así que se confirma; reactivar es directo
  function handleToggleOwner(owner) {
    if (owner.isActive) {
      setConfirmacion({ tipo: 'owner', entidad: owner })
      return
    }
    toggleOwner(owner.id)
  }

  function handleToggleRestaurante(restaurante) {
    if (restaurante.isActive) {
      setConfirmacion({ tipo: 'restaurante', entidad: restaurante })
      return
    }
    toggleRestaurante(restaurante.id)
  }

  async function handleConfirmarDesactivar() {
    const { tipo, entidad } = confirmacion
    if (tipo === 'owner') {
      await toggleOwner(entidad.id)
    } else {
      await toggleRestaurante(entidad.id)
    }
    setConfirmacion(null)
  }

  const procesandoConfirmacion =
    confirmacion?.tipo === 'owner'
      ? ownerEnProceso === confirmacion.entidad.id
      : restauranteEnProceso === confirmacion?.entidad.id

  return (
    <div className="min-h-screen bg-page">
      <AdminNavbar />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Inicio</h1>
        <p className="mt-1 text-sm text-muted">
          Clientes y restaurantes registrados en la plataforma.
        </p>

        {(errorOwners || errorRestaurantes) && (
          <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {errorOwners || errorRestaurantes}
          </p>
        )}

        <div className="mt-8">
          {cargandoOwners ? (
            <p className="text-center text-muted">Cargando clientes...</p>
          ) : (
            <>
              <Seccion
                titulo="Clientes activos"
                descripcion="Dueños que pueden iniciar sesión."
                cantidad={ownersActivos.length}
              >
                {ownersActivos.length === 0 ? (
                  <Vacio icono="👤" mensaje="No hay clientes activos." />
                ) : (
                  <div className="space-y-3">
                    {ownersActivos.map((owner) => (
                      <AdminOwnerCard
                        key={owner.id}
                        owner={owner}
                        procesando={ownerEnProceso === owner.id}
                        onToggleActivo={handleToggleOwner}
                      />
                    ))}
                  </div>
                )}
              </Seccion>

              {ownersInactivos.length > 0 && (
                <Seccion
                  titulo="Clientes desactivados"
                  descripcion="No pueden iniciar sesión ni ellos ni sus restaurantes."
                  cantidad={ownersInactivos.length}
                >
                  <div className="space-y-3">
                    {ownersInactivos.map((owner) => (
                      <AdminOwnerCard
                        key={owner.id}
                        owner={owner}
                        procesando={ownerEnProceso === owner.id}
                        onToggleActivo={handleToggleOwner}
                      />
                    ))}
                  </div>
                </Seccion>
              )}
            </>
          )}
        </div>

        <div className="mt-10 border-t border-line pt-8">
          {cargandoRestaurantes ? (
            <p className="text-center text-muted">Cargando restaurantes...</p>
          ) : (
            <Seccion
              titulo="Restaurantes"
              descripcion="Todos los locales de la plataforma."
              cantidad={restaurantes.length}
            >
              {restaurantes.length === 0 ? (
                <Vacio icono="🏪" mensaje="Todavía no hay restaurantes registrados." />
              ) : (
                <div className="space-y-3">
                  {restaurantes.map((restaurante) => (
                    <AdminRestauranteCard
                      key={restaurante.id}
                      restaurante={restaurante}
                      procesando={restauranteEnProceso === restaurante.id}
                      onToggleActivo={handleToggleRestaurante}
                    />
                  ))}
                </div>
              )}
            </Seccion>
          )}
        </div>
      </main>

      {confirmacion?.tipo === 'owner' && (
        <ConfirmarDesactivarModal
          titulo="Desactivar cliente"
          mensaje={`${confirmacion.entidad.name} no podrá volver a iniciar sesión hasta que lo reactives.`}
          advertencia={`Sus ${confirmacion.entidad._count?.restaurants ?? 0} restaurante(s) tampoco podrán iniciar sesión mientras el cliente esté desactivado.`}
          textoConfirmar="Sí, desactivar"
          procesando={procesandoConfirmacion}
          onCancelar={() => setConfirmacion(null)}
          onConfirmar={handleConfirmarDesactivar}
        />
      )}

      {confirmacion?.tipo === 'restaurante' && (
        <ConfirmarDesactivarModal
          titulo="Desactivar restaurante"
          mensaje={`${confirmacion.entidad.name} no podrá iniciar sesión hasta que lo actives de nuevo.`}
          textoConfirmar="Sí, desactivar"
          procesando={procesandoConfirmacion}
          onCancelar={() => setConfirmacion(null)}
          onConfirmar={handleConfirmarDesactivar}
        />
      )}
    </div>
  )
}
