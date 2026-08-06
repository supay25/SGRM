import { useState } from 'react'
import AdminNavbar from '../components/AdminNavbar'
import AdminCampo from '../components/AdminCampo'
import useAdminAlta from '../hooks/useAdminAlta'

function BotonCrear({ guardando, children }) {
  return (
    <button
      type="submit"
      disabled={guardando}
      className="
        rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50
        shadow-md shadow-ember/20 transition hover:bg-ember-dark active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-60
      "
    >
      {guardando ? 'Creando...' : children}
    </button>
  )
}

function FormularioOwner({ onCrear }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setExito('')

    if (!nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    if (!email.trim()) {
      setError('El correo electrónico es obligatorio')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setError('')
    setGuardando(true)
    try {
      const nuevo = await onCrear({ name: nombre.trim(), email: email.trim(), password })
      setNombre('')
      setEmail('')
      setPassword('')
      setExito(`Cliente "${nuevo.name}" creado correctamente.`)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el cliente')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-tight text-ink">Nuevo cliente (owner)</h2>
        <p className="mt-1 text-sm text-muted">
          Podrá iniciar sesión y administrar los restaurantes que le asignes.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5">
          <AdminCampo
            id="owner-nombre"
            etiqueta="Nombre"
            valor={nombre}
            onCambiar={(valor) => {
              setNombre(valor)
              setExito('')
            }}
            placeholder="Ej. Juan Pérez"
            autoComplete="off"
          />

          <AdminCampo
            id="owner-email"
            etiqueta="Correo electrónico"
            tipo="email"
            valor={email}
            onCambiar={(valor) => {
              setEmail(valor)
              setExito('')
            }}
            placeholder="cliente@correo.com"
            autoComplete="off"
            ayuda="Será su credencial de inicio de sesión."
          />

          <AdminCampo
            id="owner-password"
            etiqueta="Contraseña"
            tipo="password"
            valor={password}
            onCambiar={(valor) => {
              setPassword(valor)
              setExito('')
            }}
            placeholder="••••••••"
            autoComplete="new-password"
            ayuda="Mínimo 6 caracteres."
          />
        </div>

        {error && <p className="mt-5 text-sm text-danger">{error}</p>}
        {exito && !error && <p className="mt-5 text-sm text-success">{exito}</p>}

        <div className="mt-6 flex justify-end border-t border-line pt-5">
          <BotonCrear guardando={guardando}>Crear cliente</BotonCrear>
        </div>
      </div>
    </form>
  )
}

function FormularioRestaurante({ ownersActivos, cargandoOwners, onCrear }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setExito('')

    if (!nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    if (!email.trim()) {
      setError('El correo electrónico es obligatorio')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (!userId) {
      setError('Selecciona el cliente al que pertenece')
      return
    }

    setError('')
    setGuardando(true)
    try {
      const nuevo = await onCrear({
        name: nombre.trim(),
        email: email.trim(),
        password,
        userId: Number(userId),
      })
      setNombre('')
      setEmail('')
      setPassword('')
      setUserId('')
      setExito(`Restaurante "${nuevo.name}" creado correctamente.`)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el restaurante')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-tight text-ink">Nuevo restaurante</h2>
        <p className="mt-1 text-sm text-muted">
          El restaurante inicia sesión con sus propias credenciales.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5">
          <AdminCampo
            id="restaurante-nombre"
            etiqueta="Nombre"
            valor={nombre}
            onCambiar={(valor) => {
              setNombre(valor)
              setExito('')
            }}
            placeholder="Ej. La Parrilla Centro"
            autoComplete="off"
          />

          <AdminCampo
            id="restaurante-email"
            etiqueta="Correo electrónico"
            tipo="email"
            valor={email}
            onCambiar={(valor) => {
              setEmail(valor)
              setExito('')
            }}
            placeholder="local@restaurante.com"
            autoComplete="off"
          />

          <AdminCampo
            id="restaurante-password"
            etiqueta="Contraseña"
            tipo="password"
            valor={password}
            onCambiar={(valor) => {
              setPassword(valor)
              setExito('')
            }}
            placeholder="••••••••"
            autoComplete="new-password"
            ayuda="Mínimo 6 caracteres."
          />

          <div className="space-y-1.5">
            <label
              htmlFor="restaurante-owner"
              className="block text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Cliente (dueño)
            </label>
            <select
              id="restaurante-owner"
              value={userId}
              onChange={(event) => {
                setUserId(event.target.value)
                setExito('')
              }}
              disabled={cargandoOwners}
              className="
                w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5
                text-sm text-ink transition
                focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ember/60
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              <option value="">
                {cargandoOwners ? 'Cargando clientes...' : 'Selecciona un cliente'}
              </option>
              {ownersActivos.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} — {owner.email}
                </option>
              ))}
            </select>
            {!cargandoOwners && ownersActivos.length === 0 && (
              <p className="text-xs text-muted">
                No hay clientes activos. Crea uno primero con el formulario de arriba.
              </p>
            )}
          </div>
        </div>

        {error && <p className="mt-5 text-sm text-danger">{error}</p>}
        {exito && !error && <p className="mt-5 text-sm text-success">{exito}</p>}

        <div className="mt-6 flex justify-end border-t border-line pt-5">
          <BotonCrear guardando={guardando}>Crear restaurante</BotonCrear>
        </div>
      </div>
    </form>
  )
}

export default function AdminAgregar() {
  const { ownersActivos, cargandoOwners, errorOwners, crearOwner, crearRestaurante } =
    useAdminAlta()

  return (
    <div className="min-h-screen bg-page">
      <AdminNavbar />

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Agregar</h1>
        <p className="mt-1 text-sm text-muted">Da de alta nuevos clientes y restaurantes.</p>

        {errorOwners && (
          <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {errorOwners}
          </p>
        )}

        <div className="mt-6 space-y-6">
          <FormularioOwner onCrear={crearOwner} />
          <FormularioRestaurante
            ownersActivos={ownersActivos}
            cargandoOwners={cargandoOwners}
            onCrear={crearRestaurante}
          />
        </div>
      </main>
    </div>
  )
}
