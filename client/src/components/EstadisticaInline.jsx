export default function EstadisticaInline({ etiqueta, valor, destacada = false }) {
  return (
    <div
      className={`
        rounded-lg p-3
        ${destacada ? 'border border-ember/40 bg-ember/10' : 'bg-surface-2'}
      `}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{etiqueta}</p>
      <p className={`mt-1 font-extrabold tracking-tight ${destacada ? 'text-2xl text-ember' : 'text-xl text-ink'}`}>
        {valor}
      </p>
    </div>
  )
}
