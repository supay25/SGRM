import { useState } from 'react'

// Campo de contraseña con botón de ojo para mostrar/ocultar el texto.
// El toggle es solo visual: alterna el type entre "password" y "text",
// el valor que viaja en el formulario nunca cambia.

const CLASE_ETIQUETA = 'block text-xs font-semibold uppercase tracking-wider text-muted'

// Mismo estilo que los inputs del tema oscuro, con espacio a la derecha para el ojo
const CLASE_INPUT = `
  w-full rounded-lg border border-line bg-surface-2 py-2.5 pl-3 pr-11
  text-sm text-ink placeholder-muted transition
  focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ember/60
  disabled:cursor-not-allowed disabled:opacity-60
`

const CLASE_OJO = `
  absolute inset-y-0 right-1.5 my-auto flex h-8 w-8 items-center justify-center
  rounded-md text-muted transition
  hover:text-ink focus:outline-none focus:ring-2 focus:ring-ember/60
  disabled:cursor-not-allowed disabled:opacity-60
`

function IconoOjo({ tachado }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {tachado ? (
        <>
          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
          <path d="m2 2 20 20" />
        </>
      ) : (
        <>
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  )
}

export default function CampoPassword({
  id,
  etiqueta,
  valor,
  onCambiar,
  placeholder,
  deshabilitado,
  ayuda,
  icono,
  claseEtiqueta = CLASE_ETIQUETA,
  claseInput = CLASE_INPUT,
  claseOjo = CLASE_OJO,
  ...resto
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-1.5">
      {etiqueta && (
        <label htmlFor={id} className={claseEtiqueta}>
          {etiqueta}
        </label>
      )}

      <div className="relative">
        {icono}

        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={valor}
          onChange={(event) => onCambiar?.(event.target.value)}
          placeholder={placeholder}
          disabled={deshabilitado}
          className={claseInput}
          {...resto}
        />

        {/* type="button" para que no dispare el submit del formulario */}
        <button
          type="button"
          onClick={() => setVisible((previo) => !previo)}
          disabled={deshabilitado}
          className={claseOjo}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <IconoOjo tachado={visible} />
        </button>
      </div>

      {ayuda && <p className="text-xs text-muted">{ayuda}</p>}
    </div>
  )
}
