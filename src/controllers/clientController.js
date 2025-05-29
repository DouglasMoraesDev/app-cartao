// src/controllers/clientController.js
const prisma = require('../config/db');

/**
 * POST /api/clients/check-points
 * Retorna pontos de um cliente por telefone e estabelecimento
 */
exports.checkPoints = async (req, res, next) => {
  try {
    const { phone, establishmentId } = req.body;
    if (!phone || !establishmentId) {
      return res
        .status(400)
        .json({ message: 'phone e establishmentId são obrigatórios' });
    }

    const estId = parseInt(establishmentId, 10);
    const client = await prisma.client.findFirst({
      where: { phone, establishmentId: estId },
      select: { points: true },
    });

    if (!client) {
      return res
        .status(404)
        .json({ message: 'Cliente não encontrado neste estabelecimento.' });
    }

    res.json({ points: client.points });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/clients?establishmentId=#
 * Lista todos os clientes de um estabelecimento
 */
exports.listClients = async (req, res, next) => {
  try {
    const establishmentId = parseInt(req.query.establishmentId, 10);
    if (!establishmentId) {
      return res
        .status(400)
        .json({ message: 'EstablishmentId é obrigatório' });
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
 * Cria um novo cliente
 */
exports.createClient = async (req, res, next) => {
  try {
    const { fullName, phone, email, points, establishmentId } = req.body;
    const estId = parseInt(establishmentId, 10);
    if (!fullName || !phone || !estId) {
      return res
        .status(400)
        .json({ message: 'fullName, phone e establishmentId são obrigatórios' });
    }

    const newClient = await prisma.client.create({
      data: {
        fullName,
        phone,
        email,
        points: points || 0,
        establishmentId: estId,
      },
    });
    res.status(201).json(newClient);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/clients/:id
 * Atualiza dados de um cliente
 */
exports.updateClient = async (req, res, next) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const { fullName, phone, email, points, establishmentId } = req.body;
    const estId = parseInt(establishmentId, 10);

    if (!fullName || !phone || !estId) {
      return res
        .status(400)
        .json({ message: 'fullName, phone e establishmentId são obrigatórios' });
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        fullName,
        phone,
        email,
        points,
        establishmentId: estId,
      },
    });
    res.json({ message: 'Cliente atualizado', client: updatedClient });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/clients/:id?establishmentId=#
 * Exclui um cliente
 */
exports.deleteClient = async (req, res, next) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const estId     = parseInt(req.query.establishmentId, 10);
    if (!estId) {
      return res
        .status(400)
        .json({ message: 'EstablishmentId é obrigatório' });
    }

    await prisma.client.delete({ where: { id: clientId } });
    res.json({ message: 'Cliente excluído' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/clients/:id/points
 * Adiciona pontos a um cliente
 */
exports.addPoints = async (req, res, next) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const { pointsToAdd, establishmentId } = req.body;
    const estId = parseInt(establishmentId, 10);
    if (!estId) {
      return res
        .status(400)
        .json({ message: 'EstablishmentId é obrigatório' });
    }

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client || client.establishmentId !== estId) {
      return res
        .status(404)
        .json({ message: 'Cliente não encontrado para este estabelecimento' });
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: { points: client.points + pointsToAdd },
    });
    res.json({ message: 'Pontos adicionados', client: updatedClient });
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
    const { establishmentId } = req.body;
    const estId = parseInt(establishmentId, 10);
    if (!estId) {
      return res
        .status(400)
        .json({ message: 'EstablishmentId é obrigatório' });
    }

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client || client.establishmentId !== estId) {
      return res
        .status(404)
        .json({ message: 'Cliente não encontrado para este estabelecimento' });
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: { points: 0 },
    });
    res.json({ message: 'Pontos zerados com sucesso.', client: updatedClient });
  } catch (error) {
    next(error);
  }
};
