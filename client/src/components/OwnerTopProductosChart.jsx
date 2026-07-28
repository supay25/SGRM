import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import OwnerChartTooltip from './OwnerChartTooltip'

// Producto activo (bajo el cursor) resalta en ember; el resto queda en un ember más apagado.
const COLOR_BASE = '#b45309'
const COLOR_ACTIVO = '#d97706'

export default function OwnerTopProductosChart({ data }) {
  const productos = data.map((item) => ({ producto: item.producto, cantidad: Number(item.cantidad) }))

  if (productos.length === 0) {
    return <p className="py-10 text-center text-sm text-muted">Todavía no hay ventas registradas.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={productos} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="producto"
          width={120}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: 'var(--color-surface-2)', opacity: 0.4 }}
          content={
            <OwnerChartTooltip
              render={(payload) => (
                <p className="text-sm font-semibold text-ink">{payload[0].value} unidades</p>
              )}
            />
          }
        />
        <Bar dataKey="cantidad" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {productos.map((entry, index) => (
            <Cell key={entry.producto} fill={index === 0 ? COLOR_ACTIVO : COLOR_BASE} />
          ))}
          <LabelList
            dataKey="cantidad"
            position="right"
            style={{ fill: 'var(--color-ink)', fontSize: 12, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
