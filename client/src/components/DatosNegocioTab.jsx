import { useEffect, useState } from 'react'
import { getConfigRequest, actualizarConfigRequest } from '../api/restaurante.api.js'

const CONFIG_VACIA = {
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
        onChange={(event) => onCambiar(event.target.value)}
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

export default function DatosNegocioTab() {
  const [form, setForm] = useState(CONFIG_VACIA)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const config = await getConfigRequest()
        setForm({
          name: config.name ?? '',
          email: config.email ?? '',
          phone: config.phone ?? '',
          address: config.address ?? '',
          cedulaJuridica: config.cedulaJuridica ?? '',
          tipoCambioDolar: config.tipoCambioDolar != null ? Number(config.tipoCambioDolar) : '',
        })
      } catch (error) {
        console.error('Error al cargar la configuración:', error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  function actualizarCampo(campo, valor) {
    setForm((previo) => ({ ...previo, [campo]: valor }))
    setGuardado(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('El nombre del negocio es obligatorio')
      return
    }

    setError('')
    setGuardando(true)
    try {
      await actualizarConfigRequest({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        cedulaJuridica: form.cedulaJuridica.trim(),
        tipoCambioDolar: Number(form.tipoCambioDolar) || 0,
      })
      setGuardado(true)
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar la configuración')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return <div className="py-16 text-center text-sm text-muted">Cargando configuración...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-tight text-ink">Datos del negocio</h2>
        <p className="mt-1 text-sm text-muted">
          Esta información se usa en las facturas y en los reportes del restaurante.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo
              id="config-name"
              etiqueta="Nombre del negocio"
              valor={form.name}
              onCambiar={(valor) => actualizarCampo('name', valor)}
              placeholder="Ej. La Buena Mesa"
            />
          </div>

          <div className="sm:col-span-2">
            <Campo
              id="config-email"
              etiqueta="Correo electrónico"
              tipo="email"
              valor={form.email}
              onCambiar={() => { }}
              deshabilitado
              ayuda="El correo es la credencial de inicio de sesión y no se puede modificar aquí."
            />
          </div>

          <Campo
            id="config-phone"
            etiqueta="Teléfono"
            tipo="tel"
            valor={form.phone}
            onCambiar={(valor) => actualizarCampo('phone', valor)}
            placeholder="Ej. 2222-3333"
          />

          <Campo
            id="config-cedula"
            etiqueta="Cédula jurídica"
            valor={form.cedulaJuridica}
            onCambiar={(valor) => actualizarCampo('cedulaJuridica', valor)}
            placeholder="Ej. 3-101-123456"
          />

          <div className="sm:col-span-2">
            <Campo
              id="config-address"
              etiqueta="Dirección"
              valor={form.address}
              onCambiar={(valor) => actualizarCampo('address', valor)}
              placeholder="Ej. San José, Costa Rica"
            />
          </div>

          <Campo
            id="config-tipo-cambio"
            etiqueta="Tipo de cambio del dólar"
            tipo="number"
            step="0.01"
            min="0"
            valor={form.tipoCambioDolar}
            onCambiar={(valor) => actualizarCampo('tipoCambioDolar', valor)}
            placeholder="Ej. 512.50"
            ayuda="Colones por cada dólar."
          />
        </div>

        {error && <p className="mt-5 text-sm text-danger">{error}</p>}
        {guardado && !error && <p className="mt-5 text-sm text-success">Cambios guardados.</p>}

        <div className="mt-6 flex justify-end border-t border-line pt-5">
          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </form>
  )
}