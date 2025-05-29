// src/controllers/voucherController.js
const prisma = require('../config/db');

/**
 * GET /api/voucher/:clienteId
 * Retorna { numero, mensagem } formatado para WhatsApp
 */
exports.getVoucher = async (req, res) => {
  try {
    const clienteId = parseInt(req.params.clienteId, 10);
    const cliente = await prisma.client.findUnique({
      where: { id: clienteId },
      select: { phone: true, establishmentId: true }
    });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Mensagem padrão ou customizada no estabelecimento
    let mensagem = 'Aqui está seu voucher!';
    if (cliente.establishmentId) {
      const est = await prisma.establishment.findUnique({
        where: { id: cliente.establishmentId },
        select: { voucherMessage: true }
      });
      mensagem = est?.voucherMessage || mensagem;
    }

    // Formata número para WhatsApp (inclui +55 se faltante)
    let numero = cliente.phone.replace(/\D/g, '');
    if (!numero.startsWith('55')) numero = '55' + numero;

    res.json({ numero, mensagem });
  } catch (error) {
    console.error('Erro ao buscar voucher:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/**
 * PUT /api/voucher/reset-points/:clienteId
 * Zera pontos do cliente após envio
 */
exports.resetPoints = async (req, res) => {
  try {
    const clienteId = parseInt(req.params.clienteId, 10);
    await prisma.client.update({
      where: { id: clienteId },
      data: { points: 0 }
    });
    res.json({ message: 'Pontos resetados com sucesso!', reload: true });
  } catch (error) {
    console.error('Erro ao resetar pontos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
