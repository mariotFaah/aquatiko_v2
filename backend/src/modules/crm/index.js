import { Router } from 'express';
import crmRoutes from './routes/index.js';

// Initialisation du module CRM
const initCRMModule = (app) => {
  console.log('🔄 Initialisation du module CRM...');
  
  // Montage des routes CRM sous le préfixe /api/crm
  app.use('/api/crm', crmRoutes);
  
  console.log('✅ Module CRM initialisé avec succès');
};

export default initCRMModule;
