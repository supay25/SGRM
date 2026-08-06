import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import seccionRouter from './routes/seccion.routes.js'
import categoriasRouter from './routes/categorias.routes.js'
import productosRouter from './routes/productos.routes.js'
import mesaRouter from './routes/mesas.routes.js'
import ordenRoutes from './routes/orden.routes.js';
import facturaRoutes from './routes/factura.routes.js';
import cierreRoutes from './routes/cierres.routes.js';
import ownerRoutes from './routes/owner.routes/owner.routes.js'
import reportesRoutes from './routes/reportes.routes.js';
import restauranteRoutes from './routes/restaurante.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import adminRoutes from './routes/admin/admin.routes.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // Para que el servidor entienda JSON

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/secciones', seccionRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/productos', productosRouter);
app.use('/api/mesas', mesaRouter);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/cierres', cierreRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/restaurante', restauranteRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/admin', adminRoutes);
// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'El servidor está vivo y respondiendo' });
});

// Prender el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});