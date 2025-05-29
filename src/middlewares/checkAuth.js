// src/middlewares/checkAuth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.checkAuth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  const token = h.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
    req.user = {
      id:               decoded.userId,
      establishmentId:  decoded.establishmentId
    };
    next();
  });
};
