import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'gestion_entreprise',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'mot_de_passe', // A changer en production
      charset: 'utf8mb4'
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
  },
  
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    migrations: {
      directory: './migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};