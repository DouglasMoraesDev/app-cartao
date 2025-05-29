// src/routes/voucherRoutes.js
const router = require('express').Router();
const ctrl   = require('../controllers/voucherController');

// Obter dados para envio de voucher
router.get('/:clienteId',                ctrl.getVoucher);
// Resetar pontos após envio
router.put('/reset-points/:clienteId',   ctrl.resetPoints);

module.exports = router;
