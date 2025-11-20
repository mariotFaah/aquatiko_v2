import bcrypt from 'bcryptjs';

export const seed = async function(knex) {
  // Vider la table d'abord
  await knex('users').del();
  
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  await knex('users').insert([
    {
      email: 'admin@aquatiko.mg',
      nom: 'Admin',
      prenom: 'Principal',
      password_hash: hashedPassword,
      role: 'admin'
    },
    {
      email: 'comptable@aquatiko.mg', 
      nom: 'Comptable',
      prenom: 'Marie',
      password_hash: hashedPassword,
      role: 'comptable'
    },
    {
      email: 'commercial@aquatiko.mg',
      nom: 'Commercial',
      prenom: 'Pierre', 
      password_hash: hashedPassword,
      role: 'commercial'
    }
  ]);
};