import { db } from '../src/core/database/connection.js';

export async function seed(knex) {
  // Insérer des articles
  await db('articles').insert([
    {
      code_article: 'ART001',
      description: 'Ordinateur Portable',
      prix_unitaire: 2500000,
      taux_tva: 20,
      unite: 'unite'
    },
    {
      code_article: 'ART002',
      description: 'Souris USB',
      prix_unitaire: 15000,
      taux_tva: 20,
      unite: 'unite'
    },
    {
      code_article: 'ART003',
      description: 'Clavier Mécanique',
      prix_unitaire: 80000,
      taux_tva: 20,
      unite: 'unite'
    },
    {
      code_article: 'ART004',
      description: 'Service Maintenance',
      prix_unitaire: 150000,
      taux_tva: 20,
      unite: 'heure'
    },
    {
      code_article: 'ART005',
      description: 'Formation Logiciel',
      prix_unitaire: 500000,
      taux_tva: 0, // Service export exonéré
      unite: 'jour'
    }
  ]);

  console.log('✅ Articles insérés avec succès');
}

export async function unseed(knex) {
  await db('articles').truncate();
}