// src/routes/userRoutes.js
const router = require('express').Router();
const { login } = require('../controllers/userController');

// Rota de login
router.post('/', login);

module.exports = router;
