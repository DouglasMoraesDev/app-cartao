// src/config/db.js
// Cria UMA instância compartilhada do PrismaClient
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
