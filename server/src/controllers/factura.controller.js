import { crearFactura, listarFacturas , anularFactura, obtenerFactura} from '../services/factura.service.js';

export const crear = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { mesaId } = req.body;
    const factura = await crearFactura(restaurantId, Number(mesaId));
    res.status(201).json(factura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listar = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const facturas = await listarFacturas(restaurantId);
    res.status(200).json(facturas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const anular = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { id } = req.params;;
    const factura = await anularFactura(restaurantId, Number(id));
    res.status(200).json(factura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const obtener = async (req, res) => {
  try {
    const restaurantId = req.usuario.id;
    const { id } = req.params;
    const factura = await obtenerFactura(restaurantId, Number(id));
    res.status(200).json(factura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};