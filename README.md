# SGRM — Sistema de Gestión de Restaurantes

Sistema POS multi-tenant para restaurantes: gestión de mesas, órdenes, facturación y reportería de ventas. Una sola instancia da servicio a múltiples restaurantes con aislamiento de datos por tenant.

**Demo en vivo:** [sgrm.vercel.app](https://sgrm.vercel.app)

> **Usuario de prueba**
> Correo: `tester`
> Contraseña: `123456789`

> **Usuario de prueba**
> Correo: `restest`
> Contraseña: `123456789`
---

| Dashboard | Gestión de mesas |
|---|---|
| ![Dashboard](https://github.com/user-attachments/assets/1abd792c-c27f-4c89-b524-ebb0b1877d53) | ![Gestión de mesas](https://github.com/user-attachments/assets/39df2a59-144d-4b74-8678-08c09052f9d1) |

| Órdenes | Facturación |
|---|---|
| ![Órdenes](https://github.com/user-attachments/assets/a3df7634-92b0-48cb-86bc-ca433b7ff927) | ![Facturación](https://github.com/user-attachments/assets/b53aa877-6977-4f68-beba-c9d9f15fc02f) |
---

## Stack

**Frontend:** React · Tailwind CSS · Axios
**Backend:** Node.js · Express · API REST
**Base de datos:** PostgreSQL · Prisma ORM
**Autenticación:** JWT
**Despliegue:** Vercel (frontend) · Railway (backend y base de datos)

---

## Características

- **Arquitectura multi-tenant** con base de datos compartida y aislamiento por `restaurantId`, de modo que cada restaurante solo accede a sus propios datos.
- **Autenticación con JWT** que separa cuentas de usuario de cuentas de restaurante, con rutas protegidas en el frontend e interceptores de Axios para el manejo de tokens.
- **Control de acceso por roles** (OWNER / SUPER_ADMIN) sobre las operaciones sensibles.
- **Core operativo modelado relacionalmente:** secciones, mesas, órdenes, ítems, facturas y cierres de caja.
- **Facturación con snapshots relacionales:** cada factura conserva una copia de los datos del producto al momento de la venta, de forma que la reportería histórica se mantiene íntegra aunque el menú cambie o se eliminen productos.
- **Reportería de ventas** construida sobre esos snapshots.

---

## Decisiones técnicas

**¿Por qué multi-tenant con base de datos compartida?**
Permite dar servicio a varios restaurantes desde una sola instancia, manteniendo bajos los costos de infraestructura y simplificando el despliegue y las migraciones frente al enfoque de una base por cliente. El aislamiento se garantiza filtrando por `restaurantId` en cada consulta.

**¿Por qué snapshots en las facturas en vez de referencias directas?**
Si una factura solo referenciara al producto por ID, editar el precio o eliminar un ítem del menú corrompería el histórico de ventas. Guardar un snapshot de nombre y precio al momento de la venta mantiene la reportería fiel a lo que realmente ocurrió.

**¿Por qué separar cuentas de usuario de cuentas de restaurante?**
Permite que una misma persona pueda estar asociada a más de un restaurante y que los permisos se manejen por relación, en lugar de acoplar la identidad del usuario a un solo tenant.

---
## Instalación local

Requisitos: Node.js 18+, PostgreSQL.

```bash
# Clonar el repositorio
git clone https://github.com/supay25/SGRM.git
cd SGRM
```

**Backend**

```bash
cd server
npm install
```

Antes de continuar, creá un archivo `server/.env` con las siguientes variables:

```
DATABASE_URL=          # cadena de conexión a PostgreSQL
JWT_SECRET=            # clave para firmar los tokens
PORT=
```

Luego aplicá las migraciones y levantá el servidor:

```bash
npx prisma migrate dev
npm run dev
```

**Frontend**

```bash
cd client
npm install
npm run dev
```

---
## Estructura del proyecto

```
SGRM/
├── client/     # Frontend en React
└── server/     # API REST en Express + Prisma
```

---

## Estado del proyecto

En desarrollo activo. El sistema está desplegado y operativo; actualmente se trabaja en el módulo de impresión de facturas y en ajustes de interfaz.

---

## Autor

**Luis Arturo Diaz Uceda** — [GitHub](https://github.com/supay25) · [LinkedIn](https://www.linkedin.com/in/arturo-diaz-uceda-43679a2b7 )
