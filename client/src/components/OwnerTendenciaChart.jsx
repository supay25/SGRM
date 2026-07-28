import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatearColones } from '../utils/formato'
import OwnerChartTooltip from './OwnerChartTooltip'

function formatearFechaCorta(fecha) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit' })
}

export default function OwnerTendenciaChart({ data }) {
  const puntos = data.map((item) => ({
    fecha: formatearFechaCorta(item.fecha),
    ingresoReal: Number(item.ingresoReal),
  }))

  if (puntos.length === 0) {
    return <p className="py-10 text-center text-sm text-muted">Todavía no hay cierres registrados.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={puntos} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--color-line)" strokeOpacity={0.4} vertical={false} />
        <XAxis
          dataKey="fecha"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
        />
        <YAxis hide domain={['dataMin - dataMin * 0.1', 'dataMax + dataMax * 0.1']} />
        <Tooltip
          cursor={{ stroke: 'var(--color-line)', strokeWidth: 1 }}
          content={
            <OwnerChartTooltip
              render={(payload) => (
                <p className="text-sm font-semibold text-ink">{formatearColones(payload[0].value)}</p>
              )}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="ingresoReal"
          stroke="var(--color-ember)"
          strokeWidth={2}
          dot={{ r: 4, fill: 'var(--color-ember)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: 'var(--color-ember)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
