// server.js
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');

const { checkAuth }         = require('./src/middlewares/checkAuth');
const { checkSubscription } = require('./src/middlewares/checkSubscription');
const { checkAdmin }        = require('./src/middlewares/checkAdmin');

const clientRoutes        = require('./src/routes/clientRoutes');
const userRoutes          = require('./src/routes/userRoutes');            // POST /api/login
const establishmentRoutes = require('./src/routes/establishmentRoutes');
const voucherRoutes       = require('./src/routes/voucherRoutes');
const adminRoutes         = require('./src/routes/adminRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rotas Públicas da API
app.use('/api/clients',        clientRoutes);
app.use('/api/login',          userRoutes);
app.use('/api/establishments', establishmentRoutes);
app.use('/api/voucher',        voucherRoutes);

// ============================
// Serve login.html na raiz `/`
// ============================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

// ============================
// Serve todas as páginas HTML
// (public/html/*.html via /nome.html)
// ============================
app.use(
  express.static(path.join(__dirname, 'public', 'html'))
);

// ============================
// Serve CSS, JS e imagens
// (public/* via /css, /js, /logo, etc.)
// ============================
app.use(
  express.static(path.join(__dirname, 'public'))
);

// Rotas Admin (JWT + assinatura + role)
app.use(
  '/api/admin',
  checkAuth,
  checkSubscription,
  checkAdmin,
  adminRoutes
);

// Middleware de Erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro no servidor', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
