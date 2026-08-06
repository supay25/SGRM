import { useEffect, useState } from 'react'
import { editarRestauranteRequest, resetearPasswordRestauranteRequest } from '../api/owner.api.js'
import { formatearColones } from '../utils/formato'

const DATOS_VACIOS = {
  name: '',
  email: '',
  phone: '',
  address: '',
  cedulaJuridica: '',
  tipoCambioDolar: '',
}

function Campo({ id, etiqueta, valor, onCambiar, tipo = 'text', placeholder, deshabilitado, ayuda, ...resto }) {
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

export default function OwnerConfiguracionRestauranteTab({ restauranteId, restaurante }) {
  const [form, setForm] = useState(DATOS_VACIOS)
  const [errorDatos, setErrorDatos] = useState('')
  const [guardado, setGuardado] = useState(false)
  const [guardandoDatos, setGuardandoDatos] = useState(false)

  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [exitoPassword, setExitoPassword] = useState('')
  const [reseteando, setReseteando] = useState(false)

  // El detalle ya viene cargado desde useOwnerRestauranteDetalle; solo lo volcamos al formulario
  useEffect(() => {
    if (!restaurante) return
    setForm({
      name: restaurante.name ?? '',
      email: restaurante.email ?? '',
      phone: restaurante.phone ?? '',
      address: restaurante.address ?? '',
      cedulaJuridica: restaurante.cedulaJuridica ?? '',
      // tipoCambioDolar llega como string (Decimal de Prisma)
      tipoCambioDolar: restaurante.tipoCambioDolar != null ? Number(restaurante.tipoCambioDolar) : '',
    })
  }, [restaurante])

  function actualizarCampo(campo, valor) {
    setForm((previo) => ({ ...previo, [campo]: valor }))
    setGuardado(false)
  }

  async function handleSubmitDatos(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setErrorDatos('El nombre del negocio es obligatorio')
      return
    }

    setErrorDatos('')
    setGuardandoDatos(true)
    try {
      await editarRestauranteRequest(restauranteId, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        cedulaJuridica: form.cedulaJuridica.trim(),
        tipoCambioDolar: Number(form.tipoCambioDolar) || 0,
      })
      setGuardado(true)
    } catch (error) {
      setErrorDatos(error.response?.data?.error || 'Error al guardar los datos del restaurante')
    } finally {
      setGuardandoDatos(false)
    }
  }

  async function handleSubmitPassword(event) {
    event.preventDefault()
    setExitoPassword('')

    if (passwordNueva.length < 6) {
      setErrorPassword('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    if (passwordNueva !== passwordConfirmar) {
      setErrorPassword('Las contraseñas no coinciden')
      return
    }

    setErrorPassword('')
    setReseteando(true)
    try {
      await resetearPasswordRestauranteRequest(restauranteId, passwordNueva)
      setPasswordNueva('')
      setPasswordConfirmar('')
      setExitoPassword('Contraseña del restaurante actualizada.')
    } catch (error) {
      setErrorPassword(error.response?.data?.error || 'Error al resetear la contraseña')
    } finally {
      setReseteando(false)
    }
  }

  const tipoCambio = Number(form.tipoCambioDolar)

  return (
    <div className="mt-6 max-w-2xl space-y-6">
      <form onSubmit={handleSubmitDatos}>
        <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-sm font-semibold tracking-tight text-ink">Datos del negocio</h2>
          <p className="mt-1 text-sm text-muted">
            Esta información se usa en las facturas y en los reportes de este restaurante.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Campo
                id="rest-config-name"
                etiqueta="Nombre del negocio"
                valor={form.name}
                onCambiar={(valor) => actualizarCampo('name', valor)}
                placeholder="Ej. La Buena Mesa"
              />
            </div>

            <div className="sm:col-span-2">
              <Campo
                id="rest-config-email"
                etiqueta="Correo electrónico"
                tipo="email"
                valor={form.email}
                deshabilitado
                ayuda="El correo es la credencial de inicio de sesión y no se puede modificar aquí."
              />
            </div>

            <Campo
              id="rest-config-phone"
              etiqueta="Teléfono"
              tipo="tel"
              valor={form.phone}
              onCambiar={(valor) => actualizarCampo('phone', valor)}
              placeholder="Ej. 2222-3333"
            />

            <Campo
              id="rest-config-cedula"
              etiqueta="Cédula jurídica"
              valor={form.cedulaJuridica}
              onCambiar={(valor) => actualizarCampo('cedulaJuridica', valor)}
              placeholder="Ej. 3-101-123456"
            />

            <div className="sm:col-span-2">
              <Campo
                id="rest-config-address"
                etiqueta="Dirección"
                valor={form.address}
                onCambiar={(valor) => actualizarCampo('address', valor)}
                placeholder="Ej. San José, Costa Rica"
              />
            </div>

            <Campo
              id="rest-config-tipo-cambio"
              etiqueta="Tipo de cambio del dólar"
              tipo="number"
              step="0.01"
              min="0"
              valor={form.tipoCambioDolar}
              onCambiar={(valor) => actualizarCampo('tipoCambioDolar', valor)}
              placeholder="Ej. 512.50"
              ayuda={tipoCambio > 0 ? `1 USD ≈ ${formatearColones(tipoCambio)}` : 'Colones por cada dólar.'}
            />
          </div>

          {errorDatos && <p className="mt-5 text-sm text-danger">{errorDatos}</p>}
          {guardado && !errorDatos && <p className="mt-5 text-sm text-success">Cambios guardados.</p>}

          <div className="mt-6 flex justify-end border-t border-line pt-5">
            <button
              type="submit"
              disabled={guardandoDatos}
              className="rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardandoDatos ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </form>

      <form onSubmit={handleSubmitPassword}>
        <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-sm font-semibold tracking-tight text-ink">Resetear contraseña del restaurante</h2>
          <p className="mt-1 text-sm text-muted">
            El personal deberá iniciar sesión con la nueva contraseña.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Campo
              id="rest-password-nueva"
              etiqueta="Nueva contraseña"
              tipo="password"
              valor={passwordNueva}
              onCambiar={setPasswordNueva}
              placeholder="••••••••"
              autoComplete="new-password"
              ayuda="Mínimo 6 caracteres."
            />

            <Campo
              id="rest-password-confirmar"
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
            <button
              type="submit"
              disabled={reseteando}
              className="rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reseteando ? 'Reseteando...' : 'Resetear contraseña'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
