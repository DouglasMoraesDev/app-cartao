// src/routes/adminRoutes.js
const router  = require('express').Router();
const ctrl    = require('../controllers/adminController');

router.get('/',      ctrl.listEstablishments);
router.put('/:id',   ctrl.updateEstablishment);
router.delete('/:id',ctrl.deleteEstablishment);

module.exports = router;
