// src/routes/clientRoutes.js
const router = require('express').Router();
const ctrl   = require('../controllers/clientController');

// Rota para checar pontos pelo telefone
router.post('/check-points', ctrl.checkPoints);

// Listar e criar clientes
router.get('/',    ctrl.listClients);
router.post('/',   ctrl.createClient);

// Operações sobre um cliente específico
router.get('/:id',            ctrl.getClient);
router.put('/:id',            ctrl.updateClient);
router.delete('/:id',         ctrl.deleteClient);

// Gerenciamento de pontos
router.post('/:id/points',    ctrl.addPoints);
router.put('/:id/reset',      ctrl.resetClientPoints);

module.exports = router;
