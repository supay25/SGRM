import 'dotenv/config';
import prisma from './src/config/db.js';

const RESTAURANT_ID = 3;   // ← verificá cuál es el tuyo en Prisma Studio

const main = async () => {
  const r = await prisma.restaurant.findUnique({ where: { id: RESTAURANT_ID } });
  if (!r) throw new Error(`No existe restaurante con id ${RESTAURANT_ID}`);

  const facturaIds = (await prisma.factura.findMany({
    where: { restaurantId: RESTAURANT_ID }, select: { id: true },
  })).map((f) => f.id);

  const ordenIds = (await prisma.orden.findMany({
    where: { restaurantId: RESTAURANT_ID }, select: { id: true },
  })).map((o) => o.id);

  const cierres = await prisma.cierre.count({ where: { restaurantId: RESTAURANT_ID } });
  const anulados = await prisma.itemAnulado.count({ where: { restaurantId: RESTAURANT_ID } });

  console.log(`\nRestaurante: ${r.name} (id ${r.id})`);
  console.log(`  facturas:      ${facturaIds.length}`);
  console.log(`  órdenes:       ${ordenIds.length}`);
  console.log(`  cierres:       ${cierres}`);
  console.log(`  items anulados:${anulados}`);

  if (process.argv[2] !== '--confirmar') {
    console.log('\nNo se borró nada. Corré con --confirmar para ejecutar.\n');
    return;
  }

  await prisma.$transaction([
    prisma.facturaItem.deleteMany({ where: { facturaId: { in: facturaIds } } }),
    prisma.ordenItem.deleteMany({ where: { ordenId: { in: ordenIds } } }),
    prisma.itemAnulado.deleteMany({ where: { restaurantId: RESTAURANT_ID } }),
    prisma.factura.deleteMany({ where: { restaurantId: RESTAURANT_ID } }),
    prisma.orden.deleteMany({ where: { restaurantId: RESTAURANT_ID } }),
    prisma.cierre.deleteMany({ where: { restaurantId: RESTAURANT_ID } }),
  ]);

  console.log('\nListo. Datos transaccionales borrados.\n');
};

main()
  .catch((e) => console.error('ERROR:', e.message))
  .finally(() => prisma.$disconnect());