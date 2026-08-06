import { useState } from 'react'
import AdminNavbar from '../components/AdminNavbar'
import AdminCampo from '../components/AdminCampo'
import { editarPerfilAdminRequest, cambiarPasswordAdminRequest } from '../api/admin.api.js'


function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null')
  } catch {
    return null
  }
}

function BotonGuardar({ guardando, children }) {
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
      {guardando ? 'Guardando...' : children}
    </button>
  )
}

export default function AdminConfiguracion() {
  const usuario = leerUsuario()

  const [nombre, setNombre] = useState(usuario?.name ?? '')
  const [errorPerfil, setErrorPerfil] = useState('')
  const [avisoPerfil, setAvisoPerfil] = useState('')
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)

  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [avisoPassword, setAvisoPassword] = useState('')
  const [guardandoPassword, setGuardandoPassword] = useState(false)

  async function handleSubmitPerfil(event) {
    event.preventDefault()
    setAvisoPerfil('')

    if (!nombre.trim()) {
      setErrorPerfil('El nombre es obligatorio')
      return
    }

    setErrorPerfil('')
    setGuardandoPerfil(true)
    try {
     
      const actualizado = await editarPerfilAdminRequest(nombre.trim())
      localStorage.setItem('user', JSON.stringify({ ...usuario, ...actualizado }))
      setNombre(actualizado?.name ?? nombre.trim())
      setAvisoPerfil('Nombre actualizado correctamente')
    } catch (error) {
      setErrorPerfil(error.response?.data?.error || 'Error al actualizar el nombre')
    } finally {
      setGuardandoPerfil(false)
    }
  }

  async function handleSubmitPassword(event) {
    event.preventDefault()
    setAvisoPassword('')

    if (!passwordActual) {
      setErrorPassword('Ingresa tu contraseña actual')
      return
    }
    if (passwordNueva.length < 6) {
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
  
      await cambiarPasswordAdminRequest(passwordActual, passwordNueva)
      setPasswordActual('')
      setPasswordNueva('')
      setPasswordConfirmar('')
      setAvisoPassword('Contraseña actualizada correctamente')
    } catch (error) {
      setErrorPassword(error.response?.data?.error || 'Error al actualizar la contraseña')
    } finally {
      setGuardandoPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <AdminNavbar />

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Configuración</h1>
        <p className="mt-1 text-sm text-muted">Administra los datos de tu cuenta.</p>

        <div className="mt-6 space-y-6">
          <form onSubmit={handleSubmitPerfil} noValidate>
            <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="text-sm font-semibold tracking-tight text-ink">Mis datos</h2>
              <p className="mt-1 text-sm text-muted">
                Tu nombre aparece en el panel de administración.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5">
                <AdminCampo
                  id="admin-nombre"
                  etiqueta="Nombre"
                  valor={nombre}
                  onCambiar={(valor) => {
                    setNombre(valor)
                    setAvisoPerfil('')
                  }}
                  placeholder="Ej. Ana Rodríguez"
                  autoComplete="name"
                />

                <AdminCampo
                  id="admin-email"
                  etiqueta="Correo electrónico"
                  tipo="email"
                  valor={usuario?.email ?? ''}
                  deshabilitado
                  ayuda="El correo es la credencial de inicio de sesión y no se puede modificar aquí."
                />
              </div>

              {errorPerfil && <p className="mt-5 text-sm text-danger">{errorPerfil}</p>}
              {avisoPerfil && !errorPerfil && <p className="mt-5 text-sm text-muted">{avisoPerfil}</p>}

              <div className="mt-6 flex justify-end border-t border-line pt-5">
                <BotonGuardar guardando={guardandoPerfil}>Guardar</BotonGuardar>
              </div>
            </div>
          </form>

          <form onSubmit={handleSubmitPassword} noValidate>
            <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="text-sm font-semibold tracking-tight text-ink">Cambiar mi contraseña</h2>
              <p className="mt-1 text-sm text-muted">
                Debes confirmar tu contraseña actual para poder cambiarla.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5">
                <AdminCampo
                  id="admin-password-actual"
                  etiqueta="Contraseña actual"
                  tipo="password"
                  valor={passwordActual}
                  onCambiar={(valor) => {
                    setPasswordActual(valor)
                    setAvisoPassword('')
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />

                <AdminCampo
                  id="admin-password-nueva"
                  etiqueta="Nueva contraseña"
                  tipo="password"
                  valor={passwordNueva}
                  onCambiar={(valor) => {
                    setPasswordNueva(valor)
                    setAvisoPassword('')
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  ayuda="Mínimo 6 caracteres."
                />

                <AdminCampo
                  id="admin-password-confirmar"
                  etiqueta="Confirmar nueva contraseña"
                  tipo="password"
                  valor={passwordConfirmar}
                  onCambiar={(valor) => {
                    setPasswordConfirmar(valor)
                    setAvisoPassword('')
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              {errorPassword && <p className="mt-5 text-sm text-danger">{errorPassword}</p>}
              {avisoPassword && !errorPassword && (
                <p className="mt-5 text-sm text-muted">{avisoPassword}</p>
              )}

              <div className="mt-6 flex justify-end border-t border-line pt-5">
                <BotonGuardar guardando={guardandoPassword}>Cambiar contraseña</BotonGuardar>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
