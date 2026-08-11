// server/limpiar.js
import 'dotenv/config';
import prisma from './src/config/db.js';

const [, , idArg, flag] = process.argv;

const main = async () => {
  // Sin argumentos: listar los restaurantes de esta base
  if (!idArg) {
    const rests = await prisma.restaurant.findMany({
      select: { id: true, name: true },
      orderBy: { id: 'asc' },
    });
    console.log('\nRestaurantes en esta base:');
    for (const r of rests) console.log(`  ${r.id}\t${r.name}`);
    console.log('\nUso: node limpiar.js <id> [--confirmar]\n');
    return;
  }

  const restaurantId = Number(idArg);
  const r = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!r) throw new Error(`No existe restaurante con id ${restaurantId}`);

  const facturaIds = (await prisma.factura.findMany({
    where: { restaurantId }, select: { id: true },
  })).map((f) => f.id);

  const ordenIds = (await prisma.orden.findMany({
    where: { restaurantId }, select: { id: true },
  })).map((o) => o.id);

  const cierres = await prisma.cierre.count({ where: { restaurantId } });
  const anulados = await prisma.itemAnulado.count({ where: { restaurantId } });

  console.log(`\nRestaurante: ${r.name} (id ${r.id})`);
  console.log(`  facturas:       ${facturaIds.length}`);
  console.log(`  órdenes:        ${ordenIds.length}`);
  console.log(`  cierres:        ${cierres}`);
  console.log(`  items anulados: ${anulados}`);

  if (flag !== '--confirmar') {
    console.log('\nNo se borró nada. Agregá --confirmar para ejecutar.\n');
    return;
  }

  await prisma.$transaction([
    prisma.facturaItem.deleteMany({ where: { facturaId: { in: facturaIds } } }),
    prisma.ordenItem.deleteMany({ where: { ordenId: { in: ordenIds } } }),
    prisma.itemAnulado.deleteMany({ where: { restaurantId } }),
    prisma.factura.deleteMany({ where: { restaurantId } }),
    prisma.orden.deleteMany({ where: { restaurantId } }),
    prisma.cierre.deleteMany({ where: { restaurantId } }),
  ]);

  console.log('\nListo. Datos transaccionales borrados.\n');
};

main()
  .catch((e) => console.error('ERROR:', e.message))
  .finally(() => prisma.$disconnect());