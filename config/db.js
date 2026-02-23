/*const { Pool } = require("pg");
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

module.exports = pool;*/

const { Pool } = require("pg");
require("dotenv").config();

// Usamos la URL de la base de datos de la variable de entorno
// Si no existe (en local), podrías poner una por defecto, 
// pero en Render configuraremos esta variable.
const connectionString = process.env.DATABASE_URL;

const db = new Pool({
  connectionString: connectionString,
  ssl: {
    // Esto es obligatorio para conectar con Render desde afuera
    rejectUnauthorized: false,
  },
});

db.on("connect", () => {
  console.log("✅ Conectado a la base de Datos en la Nube");
});

db.on("error", (err) => {
  console.error("❌ Error inesperado en el pool de Postgres", err);
});

module.exports = db;