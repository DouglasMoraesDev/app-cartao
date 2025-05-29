// src/middlewares/checkAdmin.js
const prisma = require('../config/db');

exports.checkAdmin = async (req, res, next) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user || user.role !== 'owner') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  next();
};
