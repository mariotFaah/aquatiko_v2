import { Router } from 'express';
import clientsRoutes from './clients.routes.js';
import devisRoutes from './devis.routes.js';
import contactsRoutes from './contacts.routes.js';
import relancesRoutes from './relances.routes.js';
import activitesRoutes from './activites.routes.js';

const router = Router();

// Montage des routes
router.use('/clients', clientsRoutes);
router.use('/devis', devisRoutes);
router.use('/contacts', contactsRoutes);
router.use('/relances', relancesRoutes);
router.use('/activites', activitesRoutes);

// Route de santé du module CRM
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Module CRM opérationnel',
    timestamp: new Date().toISOString()
  });
});

export default router;
