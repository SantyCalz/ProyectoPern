import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // usar variable de entorno
  ssl: {
    rejectUnauthorized: false // necesario en Render
  }
});

pool.on('connect', () => {
  console.log('Conectado a la base de datos');
});

export const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';
export default pool;
