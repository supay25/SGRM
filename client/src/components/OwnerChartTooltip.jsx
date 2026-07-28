export default function OwnerChartTooltip({ active, payload, label, render }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-line bg-surface-2 px-3 py-2 shadow-lg">
      {label && <p className="mb-1 text-xs font-semibold text-muted">{label}</p>}
      {render(payload)}
    </div>
  )
}
