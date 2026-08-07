import { useState } from 'react'
import OwnerNavbar from '../components/OwnerNavbar'
import CampoPassword from '../components/CampoPassword'
import { editarPerfilOwnerRequest, cambiarPasswordOwnerRequest } from '../api/owner.api.js'

function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null')
  } catch {
    return null
  }
}

function Campo({ id, etiqueta, valor, onCambiar, tipo = 'text', placeholder, deshabilitado, ayuda, ...resto }) {
  // Las contraseñas usan el campo con ojo para mostrar/ocultar el texto
  if (tipo === 'password') {
    return (
      <CampoPassword
        id={id}
        etiqueta={etiqueta}
        valor={valor}
        onCambiar={onCambiar}
        placeholder={placeholder}
        deshabilitado={deshabilitado}
        ayuda={ayuda}
        {...resto}
      />
    )
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-muted">
        {etiqueta}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(event) => onCambiar?.(event.target.value)}
        placeholder={placeholder}
        disabled={deshabilitado}
        className="
          w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5
          text-sm text-ink placeholder-muted transition
          focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ember/60
          disabled:cursor-not-allowed disabled:opacity-60
        "
        {...resto}
      />
      {ayuda && <p className="text-xs text-muted">{ayuda}</p>}
    </div>
  )
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

export default function OwnerConfiguracion() {
  const usuario = leerUsuario()

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

  function actualizarNombre(valor) {
    setNombre(valor)
    setExitoPerfil('')
  }

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
      const actualizado = await editarPerfilOwnerRequest(nombre.trim())
      // Sincronizar el usuario guardado para que el nombre nuevo persista tras recargar
      localStorage.setItem('user', JSON.stringify({ ...usuario, ...actualizado }))
      setNombre(actualizado?.name ?? nombre.trim())
      setExitoPerfil('Nombre actualizado correctamente.')
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
      await cambiarPasswordOwnerRequest(passwordActual, passwordNueva)
      setPasswordActual('')
      setPasswordNueva('')
      setPasswordConfirmar('')
      setExitoPassword('Contraseña actualizada correctamente.')
    } catch (error) {
      setErrorPassword(error.response?.data?.error || 'Error al actualizar la contraseña')
    } finally {
      setGuardandoPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <OwnerNavbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Configuración</h1>
        <p className="mt-1 text-sm text-muted">Administra los datos de tu cuenta.</p>

        <div className="mt-6 space-y-6">
          <form onSubmit={handleSubmitPerfil}>
            <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="text-sm font-semibold tracking-tight text-ink">Mis datos</h2>
              <p className="mt-1 text-sm text-muted">
                Tu nombre aparece en el panel del dueño.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5">
                <Campo
                  id="perfil-nombre"
                  etiqueta="Nombre"
                  valor={nombre}
                  onCambiar={actualizarNombre}
                  placeholder="Ej. Juan Pérez"
                  autoComplete="name"
                />

                <Campo
                  id="perfil-email"
                  etiqueta="Correo electrónico"
                  tipo="email"
                  valor={usuario?.email ?? ''}
                  deshabilitado
                  ayuda="El correo es la credencial de inicio de sesión y no se puede modificar aquí."
                />
              </div>

              {errorPerfil && <p className="mt-5 text-sm text-danger">{errorPerfil}</p>}
              {exitoPerfil && !errorPerfil && <p className="mt-5 text-sm text-success">{exitoPerfil}</p>}

              <div className="mt-6 flex justify-end border-t border-line pt-5">
                <BotonGuardar guardando={guardandoPerfil}>Guardar</BotonGuardar>
              </div>
            </div>
          </form>

          <form onSubmit={handleSubmitPassword}>
            <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="text-sm font-semibold tracking-tight text-ink">Cambiar mi contraseña</h2>
              <p className="mt-1 text-sm text-muted">
                Debes confirmar tu contraseña actual para poder cambiarla.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5">
                <Campo
                  id="password-actual"
                  etiqueta="Contraseña actual"
                  tipo="password"
                  valor={passwordActual}
                  onCambiar={setPasswordActual}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />

                <Campo
                  id="password-nueva"
                  etiqueta="Nueva contraseña"
                  tipo="password"
                  valor={passwordNueva}
                  onCambiar={setPasswordNueva}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  ayuda="Mínimo 6 caracteres."
                />

                <Campo
                  id="password-confirmar"
                  etiqueta="Confirmar nueva contraseña"
                  tipo="password"
                  valor={passwordConfirmar}
                  onCambiar={setPasswordConfirmar}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              {errorPassword && <p className="mt-5 text-sm text-danger">{errorPassword}</p>}
              {exitoPassword && !errorPassword && <p className="mt-5 text-sm text-success">{exitoPassword}</p>}

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
