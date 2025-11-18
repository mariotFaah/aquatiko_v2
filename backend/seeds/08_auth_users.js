// backend/seeds/08_auth_users.js
import bcrypt from 'bcryptjs';

export const seed = async function(knex) {
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  // Récupérer les IDs des rôles
  const roles = await knex('roles').select('id_role', 'code_role');
  const roleMap = {};
  roles.forEach(role => {
    roleMap[role.code_role] = role.id_role;
  });

  // Insérer les utilisateurs de test
  await knex('users').insert([
    {
      email: 'admin@aquatiko.mg',
      password_hash: hashedPassword,
      nom: 'Rakoto',
      prenom: 'Jean',
      id_role: roleMap['admin']
    },
    {
      email: 'comptable@aquatiko.mg',
      password_hash: hashedPassword,
      nom: 'Rasoa',
      prenom: 'Marie',
      id_role: roleMap['comptable']
    },
    {
      email: 'commercial@aquatiko.mg',
      password_hash: hashedPassword,
      nom: 'Randria',
      prenom: 'Pierre',
      id_role: roleMap['commercial']
    },
    {
      email: 'user@aquatiko.mg',
      password_hash: hashedPassword,
      nom: 'Rabe',
      prenom: 'Alice',
      id_role: roleMap['utilisateur']
    }
  ]);
};