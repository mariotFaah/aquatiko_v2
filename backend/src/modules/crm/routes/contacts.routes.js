import { Router } from 'express';
import { ContactController } from '../controllers/ContactController.js';

const router = Router();
const contactController = new ContactController();

// Routes pour les contacts
router.get('/client/:clientId', contactController.getContactsByClient);
router.get('/:id', contactController.getContactById);
router.post('/', contactController.createContact);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

export default router;
