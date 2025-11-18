// backend/seeds/07_auth_roles.js
import bcrypt from 'bcryptjs';

export const seed = async function(knex) {
  // Supprimer les données existantes dans le bon ordre
  await knex('role_permissions').del();
  await knex('permissions').del();
  await knex('users').del();
  await knex('roles').del();

  // Insérer les rôles et récupérer leurs IDs
  const roleIds = await knex('roles').insert([
    {
      code_role: 'admin',
      nom_role: 'Administrateur',
      description: 'Accès complet à tous les modules'
    },
    {
      code_role: 'comptable',
      nom_role: 'Comptable',
      description: 'Accès au module comptabilité et rapports financiers'
    },
    {
      code_role: 'commercial',
      nom_role: 'Commercial',
      description: 'Accès aux modules CRM et Import-Export'
    },
    {
      code_role: 'utilisateur',
      nom_role: 'Utilisateur',
      description: 'Accès limité selon les permissions'
    }
  ]);

  // Récupérer les IDs des rôles insérés
  const roles = await knex('roles').select('id_role', 'code_role');
  const roleMap = {};
  roles.forEach(role => {
    roleMap[role.code_role] = role.id_role;
  });

  // Insérer les permissions
  const permissionIds = await knex('permissions').insert([
    // Module Comptabilité
    { module: 'comptabilite', action: 'read', description: 'Voir le module comptabilité' },
    { module: 'comptabilite', action: 'write', description: 'Modifier données comptables' },
    { module: 'comptabilite', action: 'validate', description: 'Valider écritures' },
    { module: 'comptabilite', action: 'export', description: 'Exporter rapports' },
    
    // Module CRM
    { module: 'crm', action: 'read', description: 'Voir le module CRM' },
    { module: 'crm', action: 'write', description: 'Modifier données CRM' },
    
    // Module Import-Export
    { module: 'import-export', action: 'read', description: 'Voir module import-export' },
    { module: 'import-export', action: 'write', description: 'Gérer commandes' },
    
    // Administration
    { module: 'admin', action: 'users', description: 'Gérer les utilisateurs' },
    { module: 'admin', action: 'system', description: 'Configuration système' }
  ]);

  // Récupérer les IDs des permissions
  const permissions = await knex('permissions').select('id_permission', 'module', 'action');
  const permissionMap = {};
  permissions.forEach(perm => {
    permissionMap[`${perm.module}_${perm.action}`] = perm.id_permission;
  });

  // Associer permissions aux rôles
  const rolePermissions = [
    // Admin - Toutes les permissions
    { id_role: roleMap['admin'], id_permission: permissionMap['comptabilite_read'] },
    { id_role: roleMap['admin'], id_permission: permissionMap['comptabilite_write'] },
    { id_role: roleMap['admin'], id_permission: permissionMap['comptabilite_validate'] },
    { id_role: roleMap['admin'], id_permission: permissionMap['comptabilite_export'] },
    { id_role: roleMap['admin'], id_permission: permissionMap['crm_read'] },
    { id_role: roleMap['admin'], id_permission: permissionMap['crm_write'] },
    { id_role: roleMap['admin'], id_permission: permissionMap['import-export_read'] },
    { id_role: roleMap['admin'], id_permission: permissionMap['import-export_write'] },
    { id_role: roleMap['admin'], id_permission: permissionMap['admin_users'] },
    { id_role: roleMap['admin'], id_permission: permissionMap['admin_system'] },
    
    // Comptable - Comptabilité seulement
    { id_role: roleMap['comptable'], id_permission: permissionMap['comptabilite_read'] },
    { id_role: roleMap['comptable'], id_permission: permissionMap['comptabilite_write'] },
    { id_role: roleMap['comptable'], id_permission: permissionMap['comptabilite_validate'] },
    { id_role: roleMap['comptable'], id_permission: permissionMap['comptabilite_export'] },
    
    // Commercial - CRM + Import-Export
    { id_role: roleMap['commercial'], id_permission: permissionMap['crm_read'] },
    { id_role: roleMap['commercial'], id_permission: permissionMap['crm_write'] },
    { id_role: roleMap['commercial'], id_permission: permissionMap['import-export_read'] },
    { id_role: roleMap['commercial'], id_permission: permissionMap['import-export_write'] },
    
    // Utilisateur - Lecture seulement
    { id_role: roleMap['utilisateur'], id_permission: permissionMap['comptabilite_read'] },
    { id_role: roleMap['utilisateur'], id_permission: permissionMap['crm_read'] },
    { id_role: roleMap['utilisateur'], id_permission: permissionMap['import-export_read'] }
  ];

  await knex('role_permissions').insert(rolePermissions);
};