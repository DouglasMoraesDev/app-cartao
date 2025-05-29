// src/controllers/establishmentController.js
const prisma = require('../config/db');
const QRCode = require('qrcode');

/**
 * GET /api/establishments/:id/qrcode
 * Retorna PNG do QR Code que aponta para /points.html?establishmentId=#
 */
exports.getQRCode = async (req, res) => {
  try {
    const establishmentId = parseInt(req.params.id, 10);
    if (!establishmentId) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // Base URL: pode vir do .env (produção) ou localhost
    const baseUrl = process.env.BASE_URL
      || `http://localhost:${process.env.PORT || 3000}`;
    const targetUrl = `${baseUrl}/points.html?establishmentId=${establishmentId}`;

    res.type('png');
    await QRCode.toFileStream(res, targetUrl);
  } catch (err) {
    console.error('[getQRCode]:', err);
    res.status(500).json({ message: 'Erro ao gerar QR Code.' });
  }
};

/**
 * GET /api/establishments/:id
 * Retorna todos os dados do estabelecimento para tema, logo etc.
 */
exports.getEstablishmentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const establishment = await prisma.establishment.findUnique({ where: { id } });
    if (!establishment) {
      return res.status(404).json({ message: 'Estabelecimento não encontrado' });
    }
    res.json(establishment);
  } catch (error) {
    console.error('🔥 Erro ao buscar estabelecimento:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * GET /api/establishments/:id/voucher-message
 * Retorna somente a mensagem de voucher configurada
 */
exports.getVoucherMessage = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const est = await prisma.establishment.findUnique({
      where: { id },
      select: { voucherMessage: true }
    });
    if (!est) {
      return res.status(404).json({ message: 'Estabelecimento não encontrado' });
    }
    res.json({ voucherMessage: est.voucherMessage });
  } catch (error) {
    console.error('🔥 Erro ao buscar voucher_message:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
