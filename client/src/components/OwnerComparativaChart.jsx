import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatearColones } from '../utils/formato'
import OwnerChartTooltip from './OwnerChartTooltip'

const COLOR_BASE = '#b45309'
const COLOR_TOP = '#d97706'

export default function OwnerComparativaChart({ data }) {
  const restaurantes = data
    .map((item) => ({
      restauranteId: item.restauranteId,
      nombre: item.nombre,
      ingresoReal: Number(item.ingresoReal),
    }))
    .sort((a, b) => b.ingresoReal - a.ingresoReal)

  if (restaurantes.length === 0) {
    return <p className="py-10 text-center text-sm text-muted">Todavía no hay restaurantes para comparar.</p>
  }

  // Sin ingresos en el rango todas las barras quedan en cero: no hay nada que graficar.
  if (restaurantes.every((restaurante) => restaurante.ingresoReal === 0)) {
    return <p className="py-10 text-center text-sm text-muted">No hubo ingresos en el período seleccionado.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, restaurantes.length * 56)}>
      <BarChart data={restaurantes} layout="vertical" margin={{ top: 4, right: 12, bottom: 4, left: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="nombre"
          width={110}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: 'var(--color-surface-2)', opacity: 0.4 }}
          content={
            <OwnerChartTooltip
              render={(payload) => (
                <p className="text-sm font-semibold text-ink">{formatearColones(payload[0].value)}</p>
              )}
            />
          }
        />
        <Bar dataKey="ingresoReal" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {restaurantes.map((entry, index) => (
            <Cell key={entry.restauranteId} fill={index === 0 ? COLOR_TOP : COLOR_BASE} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
