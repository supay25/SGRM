/**
 * Ticket de factura para impresora térmica de 80 mm.
 *
 * El HTML se imprime dentro de un iframe aislado (ver [useImprimirFactura]), así
 * que acá van sus propios estilos: nada de Tailwind ni de los tokens de la app,
 * porque esos colores no existen en papel térmico (solo hay negro y blanco).
 * Todo lo que viene de la base de datos se escapa antes de entrar al HTML.
 */

const CLIENTE_POR_DEFECTO = 'Cliente al contado'

function escapar(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// En el papel los montos van sin símbolo y con dos decimales: el ancho es oro.
function monto(valor) {
  return Number(valor || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function fechaDe(valor) {
  return new Date(valor).toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function horaDe(valor) {
  return new Date(valor).toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

// Mismo formato de consecutivo que se ve en pantalla, para poder cotejarlos.
function consecutivo(numeroFactura) {
  return String(numeroFactura).padStart(3, '0')
}

function lineaItem(item) {
  const totalLinea = Number(item.cantidad) * Number(item.precioUnitario)
  return `
      <div class="fila">
        <span class="cant">${escapar(item.cantidad)}</span>
        <span class="desc">${escapar(item.nombreProducto)}</span>
        <span class="monto">${monto(totalLinea)}</span>
      </div>`
}

function lineaTotal(etiqueta, valor, clase = '') {
  return `
      <div class="total ${clase}">
        <span>${escapar(etiqueta)}</span>
        <span class="monto">${monto(valor)}</span>
      </div>`
}

function lineaDato(etiqueta, valor) {
  if (!valor) return ''
  return `<div class="dato"><span>${escapar(etiqueta)}</span> ${escapar(valor)}</div>`
}

const ESTILOS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  /* El rollo es de 80 mm de ancho y de alto indefinido: lo corta la impresora.
     Sin márgenes de página, el driver ya respeta su propia zona imprimible. */
  @page { size: 80mm auto; margin: 0; }

  body {
    width: 80mm;
    background: #fff;
    color: #000;
    font-family: 'Courier New', Courier, monospace;
    font-size: 11px;
    line-height: 1.35;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* El padding inferior es el colchón para que el corte no se coma la última línea. */
  .ticket { padding: 3mm 3mm 10mm; }

  .centro { text-align: center; }
  .negrita { font-weight: 700; }
  .grande { font-size: 14px; }
  .espacio { margin-top: 2mm; }

  .sep { border-top: 1px dashed #000; margin: 2mm 0; }
  .sep-solida { border-top: 1px solid #000; margin: 1.5mm 0; }

  /* Fila de producto: cantidad fija, descripción elástica, monto pegado a la derecha. */
  .fila { display: flex; gap: 1.5mm; margin-bottom: 0.8mm; }
  .fila .cant { width: 7mm; flex-shrink: 0; }
  .fila .desc { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .fila .monto { width: 21mm; flex-shrink: 0; text-align: right; }

  .total { display: flex; justify-content: space-between; gap: 3mm; }
  .total .monto { white-space: nowrap; }
  .total.destacado { font-size: 13px; font-weight: 700; }

  .dato { overflow-wrap: anywhere; }
  .dato span { font-weight: 700; }

  .anulada {
    margin: 2mm 0;
    padding: 1.5mm 0;
    border: 1px solid #000;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
  }
`

/**
 * Devuelve el documento HTML completo del ticket.
 * `negocio` puede venir vacío (p. ej. si falló la carga de la configuración):
 * en ese caso el ticket sale sin encabezado, pero sale.
 */
export function construirTicketFactura(factura, negocio) {
  const nombreSeccion = factura.nombreSeccion ?? factura.seccion?.nombre ?? ''
  const nombreCliente = factura.nombreCliente?.trim() || CLIENTE_POR_DEFECTO
  const descuento = Number(factura.descuento || 0)
  const tipoCambio = Number(negocio?.tipoCambioDolar || 0)
  // `total` y `montoNeto` guardan lo mismo; el fallback es por si llega un registro viejo.
  const total = Number(factura.total ?? factura.montoNeto ?? 0)

  const encabezado = [
    negocio?.name && `<div class="centro negrita grande">${escapar(negocio.name)}</div>`,
    negocio?.address && `<div class="centro">${escapar(negocio.address)}</div>`,
    negocio?.phone && `<div class="centro">Tel: ${escapar(negocio.phone)}</div>`,
    negocio?.cedulaJuridica &&
      `<div class="centro">Ced. Juridica: ${escapar(negocio.cedulaJuridica)}</div>`,
  ]
    .filter(Boolean)
    .join('\n      ')

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Factura ${consecutivo(factura.numeroFactura)}</title>
  <style>${ESTILOS}</style>
</head>
<body>
  <div class="ticket">
    ${encabezado}
    <div class="sep"></div>

    <div class="negrita">FACTURA</div>
    <div>Consecutivo Interno: ${consecutivo(factura.numeroFactura)}</div>
    <div>Fecha: ${fechaDe(factura.fecha)} Hora: ${horaDe(factura.fecha)}</div>
    ${lineaDato('Cliente:', nombreCliente)}

    ${factura.anulada ? '<div class="anulada">FACTURA ANULADA</div>' : ''}

    <div class="fila espacio negrita">
      <span class="cant">Cant</span>
      <span class="desc">Descripcion</span>
      <span class="monto">Total</span>
    </div>
    <div class="sep-solida"></div>
    ${factura.items.map(lineaItem).join('')}
    ${descuento > 0 ? lineaTotal('Descuento aplicado', descuento) : ''}

    <div class="sep-solida"></div>
    <div class="centro negrita">ULTIMA LINEA</div>
    <div class="sep-solida"></div>

    ${lineaTotal('Subtotal Bruto', factura.subtotal)}
    ${lineaTotal('Imp. Servicio', factura.montoServicio)}
    ${lineaTotal('TOTAL', total, 'destacado')}
    ${
      tipoCambio > 0
        ? `<div class="sep"></div>
    <div class="total"><span>Monto en Dolares</span><span class="monto">$ ${monto(total / tipoCambio)}</span></div>`
        : ''
    }

    <div class="sep"></div>
    ${lineaDato('Cod. Mesa:', factura.nombreMesa)}
    ${lineaDato('Area:', nombreSeccion)}

    <div class="sep"></div>
    <div class="centro">¡Gracias por su visita!</div>
  </div>
</body>
</html>`
}
