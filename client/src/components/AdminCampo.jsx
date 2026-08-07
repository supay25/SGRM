import CampoPassword from './CampoPassword'

// Campo de formulario reutilizado por las páginas del panel de administración
export default function AdminCampo({
  id,
  etiqueta,
  valor,
  onCambiar,
  tipo = 'text',
  placeholder,
  deshabilitado,
  ayuda,
  ...resto
}) {
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
