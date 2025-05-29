// server.js
require('dotenv').config();           // Carrega variáveis de ambiente de .env

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');

// Middlewares de autenticação, assinatura e autorização admin
const { checkAuth }         = require('./src/middlewares/checkAuth');
const { checkSubscription } = require('./src/middlewares/checkSubscription');
const { checkAdmin }        = require('./src/middlewares/checkAdmin');

// Rotas da API
const clientRoutes        = require('./src/routes/clientRoutes');
const userRoutes          = require('./src/routes/userRoutes');            // POST /api/login
const establishmentRoutes = require('./src/routes/establishmentRoutes');
const voucherRoutes       = require('./src/routes/voucherRoutes');
const adminRoutes         = require('./src/routes/adminRoutes');

const app = express();

// ============================
// Middlewares Globais
// ============================
app.use(cors());
app.use(bodyParser.json());

// ============================
// Rotas Públicas da API
// ============================
app.use('/api/clients',        clientRoutes);
app.use('/api/login',          userRoutes);
app.use('/api/establishments', establishmentRoutes);
app.use('/api/voucher',        voucherRoutes);

// ============================
// Servir Páginas HTML
// ============================
// Primeiro mapeia public/html como raiz: 
//   public/html/login.html  -> GET /login.html
//   public/html/clients.html -> GET /clients.html
app.use(
  express.static(path.join(__dirname, 'public', 'html'))
);

// ============================
// Servir Outros Arquivos Estáticos
// ============================
// CSS, JS, imagens, manifest, etc dentro de public/
app.use(
  express.static(path.join(__dirname, 'public'))
);

// ============================
// Rotas Administrativas
// (exigem JWT válido, assinatura ativa e role 'owner')
// ============================
app.use(
  '/api/admin',
  checkAuth,
  checkSubscription,
  checkAdmin,
  adminRoutes
);

// ============================
// Middleware de Erros
// ============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro no servidor', error: err.message });
});

// ============================
// Inicialização do Servidor
// ============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
