import knex from 'knex';
import knexConfig from '../../../knexfile.js';

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

export const db = knex(config);

// Test de connexion
export const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Connexion MySQL établie avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    return false;
  }
};

export default db;