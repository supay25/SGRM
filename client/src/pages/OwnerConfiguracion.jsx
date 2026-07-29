import { useState } from 'react'
import OwnerNavbar from '../components/OwnerNavbar'

const INPUT_CLASSES = `
  w-full px-3 py-2.5 rounded-lg
  bg-surface-2 border border-line
  text-sm text-ink placeholder-muted
  focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent
  transition
`

// TODO: PATCH /api/owner/perfil { name }
async function actualizarPerfil({ name }) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const usuario = JSON.parse(localStorage.getItem('user') ?? 'null')
  localStorage.setItem('user', JSON.stringify({ ...usuario, name }))
}

// TODO: PATCH /api/owner/password { passwordActual, passwordNueva }
async function actualizarPassword() {
  await new Promise((resolve) => setTimeout(resolve, 400))
}

function Seccion({ titulo, children }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h2 className="text-sm font-semibold text-ink tracking-tight">{titulo}</h2>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Campo({ id, label, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-muted uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function OwnerConfiguracion() {
  const usuario = JSON.parse(localStorage.getItem('user') ?? 'null')

  const [nombre, setNombre] = useState(usuario?.name ?? '')
  const [errorPerfil, setErrorPerfil] = useState('')
  const [exitoPerfil, setExitoPerfil] = useState('')
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)

  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [exitoPassword, setExitoPassword] = useState('')
  const [guardandoPassword, setGuardandoPassword] = useState(false)

  async function handleSubmitPerfil(event) {
    event.preventDefault()
    setExitoPerfil('')

    if (!nombre.trim()) {
      setErrorPerfil('El nombre es obligatorio')
      return
    }

    setErrorPerfil('')
    setGuardandoPerfil(true)
    try {
      await actualizarPerfil({ name: nombre.trim() })
      setExitoPerfil('Nombre actualizado correctamente')
    } catch (error) {
      setErrorPerfil(error.response?.data?.error || 'Error al actualizar el nombre')
    } finally {
      setGuardandoPerfil(false)
    }
  }

  async function handleSubmitPassword(event) {
    event.preventDefault()
    setExitoPassword('')

    if (!passwordActual) {
      setErrorPassword('Ingresa tu contraseña actual')
      return
    }
    if (!passwordNueva || passwordNueva.length < 6) {
      setErrorPassword('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    if (passwordNueva !== passwordConfirmar) {
      setErrorPassword('Las contraseñas nuevas no coinciden')
      return
    }

    setErrorPassword('')
    setGuardandoPassword(true)
    try {
      await actualizarPassword({ passwordActual, passwordNueva })
      setExitoPassword('Contraseña actualizada correctamente')
      setPasswordActual('')
      setPasswordNueva('')
      setPasswordConfirmar('')
    } catch (error) {
      setErrorPassword(error.response?.data?.error || 'Error al actualizar la contraseña')
    } finally {
      setGuardandoPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <OwnerNavbar />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Configuración</h1>
        <p className="mt-1 text-sm text-muted">Administra los datos de tu cuenta.</p>

        <div className="mt-6 space-y-6">
          <Seccion titulo="Datos de cuenta">
            <form onSubmit={handleSubmitPerfil} className="space-y-4">
              <Campo id="config-nombre" label="Nombre de usuario">
                <input
                  id="config-nombre"
                  type="text"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  placeholder="Tu nombre"
                  className={INPUT_CLASSES}
                />
              </Campo>

              {errorPerfil && <p className="text-sm text-danger">{errorPerfil}</p>}
              {exitoPerfil && <p className="text-sm text-success">{exitoPerfil}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={guardandoPerfil}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-orange-50 bg-ember hover:bg-ember-dark shadow-md shadow-ember/20 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {guardandoPerfil ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </Seccion>

          <Seccion titulo="Cambiar contraseña">
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <Campo id="config-password-actual" label="Contraseña actual">
                <input
                  id="config-password-actual"
                  type="password"
                  value={passwordActual}
                  onChange={(event) => setPasswordActual(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={INPUT_CLASSES}
                />
              </Campo>

              <Campo id="config-password-nueva" label="Contraseña nueva">
                <input
                  id="config-password-nueva"
                  type="password"
                  value={passwordNueva}
                  onChange={(event) => setPasswordNueva(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  className={INPUT_CLASSES}
                />
              </Campo>

              <Campo id="config-password-confirmar" label="Confirmar contraseña nueva">
                <input
                  id="config-password-confirmar"
                  type="password"
                  value={passwordConfirmar}
                  onChange={(event) => setPasswordConfirmar(event.target.value)}
                  placeholder="Repite la contraseña nueva"
                  autoComplete="new-password"
                  className={INPUT_CLASSES}
                />
              </Campo>

              {errorPassword && <p className="text-sm text-danger">{errorPassword}</p>}
              {exitoPassword && <p className="text-sm text-success">{exitoPassword}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={guardandoPassword}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-orange-50 bg-ember hover:bg-ember-dark shadow-md shadow-ember/20 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {guardandoPassword ? 'Guardando...' : 'Cambiar contraseña'}
                </button>
              </div>
            </form>
          </Seccion>
        </div>
      </main>
    </div>
  )
}
