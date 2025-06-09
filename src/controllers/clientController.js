// src/controllers/clientController.js
const prisma = require('../config/db');

/**
 * POST /api/clients/check-points
 * Body: { phone, establishmentId }
 * Retorna { points } do cliente ou 404 se não existir
 */
exports.checkPoints = async (req, res, next) => {
  try {
    const { phone, establishmentId } = req.body;
    const estId = parseInt(establishmentId, 10);
    if (!phone || !estId) {
      return res.status(400).json({ message: 'phone e establishmentId são obrigatórios' });
    }
    const client = await prisma.client.findFirst({
      where: { phone, establishmentId: estId },
    });
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json({ points: client.points });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/clients
 * Query: ?establishmentId=
 * Lista todos os clientes do estabelecimento
 */
exports.listClients = async (req, res, next) => {
  try {
    const establishmentId = parseInt(req.query.establishmentId, 10);
    if (!establishmentId) {
      return res.status(400).json({ message: 'establishmentId é obrigatório' });
    }
    const clients = await prisma.client.findMany({
      where: { establishmentId },
    });
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/clients
 * Body: { fullName, phone, email, points, establishmentId }
 */
exports.createClient = async (req, res, next) => {
  try {
    const { fullName, phone, email, points = 0, establishmentId } = req.body;
    const estId = parseInt(establishmentId, 10);
    if (!fullName || !phone || !estId) {
      return res.status(400).json({ message: 'fullName, phone e establishmentId são obrigatórios' });
    }
    const client = await prisma.client.create({
      data: { fullName, phone, email, points, establishmentId: estId },
    });
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/clients/:id
 * Query: ?establishmentId=
 */
exports.getClient = async (req, res, next) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const estId    = parseInt(req.query.establishmentId, 10);
    if (!estId) {
      return res.status(400).json({ message: 'establishmentId é obrigatório' });
    }
    const client = await prisma.client.findFirst({
      where: { id: clientId, establishmentId: estId },
    });
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/clients/:id
 * Body: { fullName, phone, email, points, establishmentId }
 */
exports.updateClient = async (req, res, next) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const { fullName, phone, email, points = 0, establishmentId } = req.body;
    const estId = parseInt(establishmentId, 10);
    if (!fullName || !phone || !estId) {
      return res.status(400).json({ message: 'fullName, phone e establishmentId são obrigatórios' });
    }
    const updated = await prisma.client.update({
      where: { id: clientId },
      data: { fullName, phone, email, points, establishmentId: estId },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/clients/:id
 * Query: ?establishmentId=
 */
exports.deleteClient = async (req, res, next) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const estId     = parseInt(req.query.establishmentId, 10);
    if (!estId) {
      return res.status(400).json({ message: 'establishmentId é obrigatório' });
    }
    const client = await prisma.client.findFirst({
      where: { id: clientId, establishmentId: estId },
    });
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    await prisma.client.delete({ where: { id: clientId } });
    res.json({ message: 'Cliente excluído' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/clients/:id/points
 * Body: { pointsToAdd }
 */
exports.addPoints = async (req, res, next) => {
  try {
    const clientId     = parseInt(req.params.id, 10);
    const { pointsToAdd } = req.body;
    if (typeof pointsToAdd !== 'number') {
      return res.status(400).json({ message: 'pointsToAdd numérico é obrigatório' });
    }
    const client = await prisma.client.update({
      where: { id: clientId },
      data: { points: { increment: pointsToAdd } },
    });
    res.json(client);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/clients/:id/reset
 * Zera os pontos do cliente
 */
exports.resetClientPoints = async (req, res, next) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const client = await prisma.client.update({
      where: { id: clientId },
      data: { points: 0 },
    });
    res.json(client);
  } catch (error) {
    next(error);
  }
};
