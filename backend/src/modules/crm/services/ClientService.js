import { ClientRepository } from '../repositories/ClientRepository.js';
import { ContactRepository } from '../repositories/ContactRepository.js';
import { DevisRepository } from '../repositories/DevisRepository.js';
import { ContratRepository } from '../repositories/ContratRepository.js';
import { ActiviteRepository } from '../repositories/ActiviteRepository.js';

export class ClientService {
  constructor() {
    this.clientRepository = new ClientRepository();
    this.contactRepository = new ContactRepository();
    this.devisRepository = new DevisRepository();
    this.contratRepository = new ContratRepository();
    this.activiteRepository = new ActiviteRepository();
  }

  async getAllClients() {
    try {
      return await this.clientRepository.findAllWithCRM();
    } catch (error) {
      console.error('Erreur ClientService.getAllClients:', error);
      throw new Error('Erreur lors de la récupération des clients');
    }
  }

  async getClientDetails(id_tiers) {
    try {
      const client = await this.clientRepository.findByIdWithDetails(id_tiers);
      
      if (!client) {
        throw new Error('Client non trouvé');
      }

      // Récupérer les statistiques
      const stats = await this.clientRepository.getClientStats(id_tiers);
      
      return {
        ...client,
        stats
      };
    } catch (error) {
      console.error('Erreur ClientService.getClientDetails:', error);
      throw new Error(`Erreur lors de la récupération du client: ${error.message}`);
    }
  }

  async updateClientCRM(id_tiers, crmData) {
    try {
      // Vérifier que le client existe
      const existingClient = await this.clientRepository.findByIdWithDetails(id_tiers);
      if (!existingClient) {
        throw new Error('Client non trouvé');
      }

      return await this.clientRepository.updateCRMData(id_tiers, crmData);
    } catch (error) {
      console.error('Erreur ClientService.updateClientCRM:', error);
      throw new Error(`Erreur lors de la mise à jour du client: ${error.message}`);
    }
  }

  async getClientActivites(id_tiers) {
    try {
      return await this.activiteRepository.findByClient(id_tiers);
    } catch (error) {
      console.error('Erreur ClientService.getClientActivites:', error);
      throw new Error('Erreur lors de la récupération des activités');
    }
  }

  async getClientDevis(id_tiers) {
    try {
      return await this.devisRepository.findByClient(id_tiers);
    } catch (error) {
      console.error('Erreur ClientService.getClientDevis:', error);
      throw new Error('Erreur lors de la récupération des devis');
    }
  }

  async getClientContrats(id_tiers) {
    try {
      return await this.contratRepository.findByClient(id_tiers);
    } catch (error) {
      console.error('Erreur ClientService.getClientContrats:', error);
      throw new Error('Erreur lors de la récupération des contrats');
    }
  }

  async getClientsByCategorie(categorie) {
    try {
      const clients = await this.clientRepository.findAllWithCRM();
      return clients.filter(client => client.categorie === categorie);
    } catch (error) {
      console.error('Erreur ClientService.getClientsByCategorie:', error);
      throw new Error('Erreur lors du filtrage des clients par catégorie');
    }
  }
}

export default ClientService;
