import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    user: process.env.MYSQLUSER || process.env.DB_USER || 'admin',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'mot_de_passe',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'gestion_entreprise',
    charset: 'utf8mb4',
    ssl: process.env.MYSQLHOST ? { rejectUnauthorized: false } : undefined
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './seeds'
  },
  pool: {
    min: 2,
    max: 10
  }
};

export default {
  development: dbConfig,
  production: dbConfig,
  test: dbConfig
};
