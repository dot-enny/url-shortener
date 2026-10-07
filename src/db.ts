import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  user: process.env.POSTGRES_USER ?? 'dev',
  password: process.env.POSTGRES_PASSWORD ?? 'secretpassword',
  database: process.env.POSTGRES_DB ?? 'shortener_db',
});

export async function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      original_url TEXT NOT NULL,
      short_code VARCHAR(16) UNIQUE NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(schema);
  console.log('Postgres schema verified and ready.');
}
