import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatearColones } from '../utils/formato'
import OwnerChartTooltip from './OwnerChartTooltip'

// Paleta categórica validada (CVD-safe, all-pairs) para hasta 3 secciones reales;
// el resto se agrupa en "Otros" con un gris neutro que no compite con las 3 identidades.
const COLORES = ['#d95926', '#3987e5', '#199e70']
const COLOR_OTROS = '#78716c'

function agruparSecciones(porSeccion) {
  const ordenadas = [...porSeccion]
    .map((item) => ({ seccion: item.seccion, total: Number(item.total), facturas: item.facturas }))
    .sort((a, b) => b.total - a.total)

  if (ordenadas.length <= 3) return ordenadas

  const top3 = ordenadas.slice(0, 3)
  const resto = ordenadas.slice(3)
  const otros = {
    seccion: 'Otros',
    total: resto.reduce((acc, item) => acc + item.total, 0),
    facturas: resto.reduce((acc, item) => acc + item.facturas, 0),
  }
  return [...top3, otros]
}

export default function OwnerVentasPorSeccionChart({ data }) {
  const secciones = agruparSecciones(data)
  const totalGeneral = secciones.reduce((acc, item) => acc + item.total, 0)

  if (secciones.length === 0) {
    return <p className="py-10 text-center text-sm text-muted">Todavía no hay ventas registradas.</p>
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={secciones}
            dataKey="total"
            nameKey="seccion"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            stroke="var(--color-surface)"
            strokeWidth={2}
          >
            {secciones.map((entry, index) => (
              <Cell key={entry.seccion} fill={entry.seccion === 'Otros' ? COLOR_OTROS : COLORES[index]} />
            ))}
          </Pie>
          <Tooltip
            content={
              <OwnerChartTooltip
                render={(payload) => (
                  <>
                    <p className="text-sm font-semibold text-ink">{payload[0].name}</p>
                    <p className="text-sm text-muted">
                      {formatearColones(payload[0].value)} · {payload[0].payload.facturas} facturas
                    </p>
                  </>
                )}
              />
            }
          />
        </PieChart>
      </ResponsiveContainer>

      <ul className="mt-2 space-y-1.5">
        {secciones.map((entry, index) => (
          <li key={entry.seccion} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.seccion === 'Otros' ? COLOR_OTROS : COLORES[index] }}
              />
              <span className="truncate text-ink">{entry.seccion}</span>
            </span>
            <span className="shrink-0 text-muted">
              {totalGeneral > 0 ? Math.round((entry.total / totalGeneral) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
