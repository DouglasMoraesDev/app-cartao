// src/routes/establishmentRoutes.js
const router = require('express').Router();
const ctrl   = require('../controllers/establishmentController');

// QR Code e dados de estabelecimento
router.get('/:id/qrcode',           ctrl.getQRCode);
router.get('/:id/voucher-message',  ctrl.getVoucherMessage);
router.get('/:id',                  ctrl.getEstablishmentById);

module.exports = router;
