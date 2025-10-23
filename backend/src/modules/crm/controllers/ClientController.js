import { ClientService } from '../services/ClientService.js';
import { ContactService } from '../services/ContactService.js';
import { successResponse, errorResponse, notFoundResponse } from '../../../core/utils/response.js';

export class ClientController {
  constructor() {
    this.clientService = new ClientService();
    this.contactService = new ContactService();
  }

  // Récupérer tous les clients avec données CRM
  getAllClients = async (req, res) => {
    try {
      const clients = await this.clientService.getAllClients();
      successResponse(res, clients, 'Clients récupérés avec succès');
    } catch (error) {
      console.error('Erreur ClientController.getAllClients:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer un client avec tous les détails
  getClientDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const client = await this.clientService.getClientDetails(parseInt(id));
      successResponse(res, client, 'Client récupéré avec succès');
    } catch (error) {
      console.error('Erreur ClientController.getClientDetails:', error);
      notFoundResponse(res, error.message);
    }
  };

  // Mettre à jour les données CRM d'un client
  updateClientCRM = async (req, res) => {
    try {
      const { id } = req.params;
      const crmData = req.body;
      
      const client = await this.clientService.updateClientCRM(parseInt(id), crmData);
      successResponse(res, client, 'Données CRM mises à jour avec succès');
    } catch (error) {
      console.error('Erreur ClientController.updateClientCRM:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Récupérer les activités d'un client
  getClientActivites = async (req, res) => {
    try {
      const { id } = req.params;
      const activites = await this.clientService.getClientActivites(parseInt(id));
      successResponse(res, activites, 'Activités récupérées avec succès');
    } catch (error) {
      console.error('Erreur ClientController.getClientActivites:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer les devis d'un client
  getClientDevis = async (req, res) => {
    try {
      const { id } = req.params;
      const devis = await this.clientService.getClientDevis(parseInt(id));
      successResponse(res, devis, 'Devis récupérés avec succès');
    } catch (error) {
      console.error('Erreur ClientController.getClientDevis:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer les contrats d'un client
  getClientContrats = async (req, res) => {
    try {
      const { id } = req.params;
      const contrats = await this.clientService.getClientContrats(parseInt(id));
      successResponse(res, contrats, 'Contrats récupérés avec succès');
    } catch (error) {
      console.error('Erreur ClientController.getClientContrats:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer les clients par catégorie
  getClientsByCategorie = async (req, res) => {
    try {
      const { categorie } = req.params;
      const clients = await this.clientService.getClientsByCategorie(categorie);
      successResponse(res, clients, `Clients ${categorie} récupérés avec succès`);
    } catch (error) {
      console.error('Erreur ClientController.getClientsByCategorie:', error);
      errorResponse(res, error.message, 500);
    }
  };
}

export default ClientController;
