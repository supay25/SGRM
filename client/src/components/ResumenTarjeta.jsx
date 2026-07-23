export default function ResumenTarjeta({ etiqueta, valor, destacada = false }) {
  return (
    <div
      className={`
        rounded-xl border p-5
        ${destacada ? 'border-ember/40 bg-ember/10' : 'border-line bg-surface'}
      `}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{etiqueta}</p>
      <p
        className={`
          mt-2 font-extrabold tracking-tight
          ${destacada ? 'text-4xl text-ember' : 'text-2xl text-ink'}
        `}
      >
        {valor}
      </p>
    </div>
  )
}
