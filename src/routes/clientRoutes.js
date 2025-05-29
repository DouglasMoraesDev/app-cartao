// src/routes/clientRoutes.js
const router = require('express').Router();
const ctrl   = require('../controllers/clientController');

// CRUD clientes + pontos + check-points
router.post('/check-points', ctrl.checkPoints);
router.get('/',              ctrl.listClients);
router.post('/',             ctrl.createClient);
router.put('/:id',           ctrl.updateClient);
router.delete('/:id',        ctrl.deleteClient);
router.post('/:id/points',   ctrl.addPoints);
router.put('/:id/reset',     ctrl.resetClientPoints);

module.exports = router;
