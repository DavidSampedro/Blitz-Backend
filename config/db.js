const { Pool } = require("pg");
require('dotenv').config(); // 👈 ¡ESTA LÍNEA ES CLAVE! Carga tus variables del .env

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Opcional: Esto te avisará en la consola si la conexión funciona
pool.on('connect', () => {
  console.log('🐘 Conectado a la base de datos PostgreSQL');
});

module.exports = pool;