import pg from "pg";
import { PG_PORT, PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE } from './config.js';

// Named export `pool` and a default export for convenience.
export const pool = new pg.Pool({
    port: PG_PORT,
    host: PG_HOST,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
});

pool.on('connect', () => {
    console.log('Conectado a la base de datos');
});

export const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';
export default pool;