import { useState } from 'react'
import { loginRequest } from '../api/auth.api' 
import { useNavigate } from 'react-router-dom'
import CampoPassword from '../components/CampoPassword'
import { rutaInicial } from '../utils/rutas'

// Iconos en SVG (no emojis): heredan currentColor y el tamaño del contenedor,
// así se mantienen consistentes con el resto del sistema y respetan el tema.
function Icono({ clase = 'h-5 w-5', children }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={clase}
    >
      {children}
    </svg>
  )
}

function IconoCubiertos() {
  return (
    <Icono clase="h-7 w-7 text-on-ember">
      <path d="M3 2v7a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2" />
      <path d="M5.5 11v11" />
      <path d="M19 2a4 4 0 0 0-3 3.87V12a1 1 0 0 0 1 1h2V2Z" />
      <path d="M18.5 13v9" />
    </Icono>
  )
}

function IconoSobre() {
  return (
    <Icono>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Icono>
  )
}

function IconoCandado() {
  return (
    <Icono>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icono>
  )
}

function IconoAlerta() {
  return (
    <Icono clase="h-4 w-4">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Icono>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await loginRequest(email, password);

      localStorage.setItem('token', data.token);
      localStorage.setItem('accountType', data.accountType);
      localStorage.setItem('user', JSON.stringify(data.user));

      // SUPER_ADMIN → /admin, OWNER → /owner, RESTAURANT → /home
      navigate(rutaInicial(data.accountType, data.user?.role));

    } catch (err) {
      // El backend responde con { error: "Credenciales invalidas" | "Esta cuenta se encuentra deshabilitada" }
      setError(err.response?.data?.error || 'No se pudo iniciar sesión. Intentá de nuevo.');
    }
  }

  // Al volver a escribir limpiamos el error para que no quede el mensaje viejo
  function handleCambiarEmail(valor) {
    setEmail(valor)
    setError('')
  }

  function handleCambiarPassword(valor) {
    setPassword(valor)
    setError('')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-10">

      {/* Tarjeta principal */}
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-ink/10">

        {/* Encabezado con franja decorativa */}
        <div className="bg-linear-to-br from-ember-dark to-ember px-8 py-7 text-center">
          <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-on-ember/15 ring-1 ring-on-ember/30">
            <IconoCubiertos />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-ember">SGRM</h1>
          <p className="mt-1 text-sm text-on-ember/85">Sistema de Gestión de Restaurante</p>
        </div>

        {/* Formulario */}
        <div className="px-8 py-8">
          <h2 className="mb-6 text-lg font-semibold text-ink">
            Inicia sesión en tu cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Campo Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                  <IconoSobre />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleCambiarEmail(e.target.value)}
                  placeholder="usuario@restaurante.com"
                  required
                  autoComplete="email"
                  className="
                    w-full rounded-lg border border-line-strong bg-surface-2 py-3 pl-10 pr-4
                    text-sm text-ink placeholder-muted transition
                    hover:border-ember/60
                    focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/40
                  "
                />
              </div>
            </div>

            {/* Campo Contraseña: hereda los estilos por token de CampoPassword */}
            <CampoPassword
              id="password"
              etiqueta="Contraseña"
              valor={password}
              onCambiar={handleCambiarPassword}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              icono={
                <span className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-muted">
                  <IconoCandado />
                </span>
              }
              claseInput="
                w-full rounded-lg border border-line-strong bg-surface-2 py-3 pl-10 pr-12
                text-sm text-ink placeholder-muted transition
                hover:border-ember/60
                focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/40
              "
            />

            {/* Enlace olvidé contraseña */}
            <div className="flex justify-end">
              <a
                href="#"
                className="-mr-2 inline-flex min-h-11 items-center rounded-md px-2 text-xs font-semibold text-ember-light transition-colors hover:text-ember-dark hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Alerta de error del backend */}
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="
                  flex items-start gap-2.5
                  rounded-lg border border-danger/40 bg-danger/10
                  px-4 py-3
                "
              >
                <span aria-hidden="true" className="mt-0.5 shrink-0 text-danger">
                  <IconoAlerta />
                </span>
                <p className="text-sm font-medium leading-5 text-danger">{error}</p>
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              className="
                mt-1 min-h-12 w-full cursor-pointer
                rounded-lg bg-ember text-sm font-semibold text-on-ember
                shadow-md shadow-ember/25
                transition-colors duration-200
                hover:bg-ember-dark active:scale-[0.99]
              "
            >
              Iniciar sesión
            </button>

          </form>
        </div>

        {/* Pie de tarjeta */}
        <div className="border-t border-line px-8 py-5 text-center">
          <span className="inline-flex items-center gap-2 text-xs text-muted">
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
            Acceso restringido al personal autorizado
          </span>
        </div>

      </div>
    </div>
  )
}
