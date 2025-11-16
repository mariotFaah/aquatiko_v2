import { Router } from 'express';
import { ClientController } from '../controllers/ClientController.js';

const router = Router();
const clientController = new ClientController();

// Routes pour les clients CRM
router.get('/', clientController.getAllClients);
router.get('/categorie/:categorie', clientController.getClientsByCategorie);
router.get('/:id', clientController.getClientDetails);
router.put('/:id/crm', clientController.updateClientCRM);
router.get('/:id/activites', clientController.getClientActivites);
router.get('/:id/activites-consolidees', clientController.getClientActivitesConsolidees);
router.get('/:id/devis', clientController.getClientDevis);
router.get('/:id/contrats', clientController.getClientContrats);

export default router;
