// src/middlewares/checkSubscription.js
const prisma = require('../config/db');
const DAYS_28_MS = 28 * 24 * 60 * 60 * 1000;

exports.checkSubscription = async (req, res, next) => {
  try {
    const est = await prisma.establishment.findUnique({
      where: { id: req.user.establishmentId },
      select: { lastPaymentDate: true }
    });
    const last = est?.lastPaymentDate;
    if (!last || (Date.now() - new Date(last).getTime()) > DAYS_28_MS) {
      return res
        .status(402)
        .json({ message: 'Assinatura expirada. Por favor, renove seu plano.' });
    }
    next();
  } catch (err) {
    console.error('Erro ao verificar assinatura:', err);
    res.status(500).json({ message: 'Erro ao verificar assinatura' });
  }
};
