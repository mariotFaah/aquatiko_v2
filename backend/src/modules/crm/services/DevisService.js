import { DevisRepository } from '../repositories/DevisRepository.js';

export class DevisService {
  constructor() {
    this.devisRepository = new DevisRepository();
  }

  async getAllDevis() {
    try {
      return await this.devisRepository.findAll();
    } catch (error) {
      console.error('Erreur DevisService.getAllDevis:', error);
      throw new Error('Erreur lors de la récupération des devis');
    }
  }

  async getDevisById(id_devis) {
    try {
      const devis = await this.devisRepository.findById(id_devis);
      
      if (!devis) {
        throw new Error('Devis non trouvé');
      }

      return devis;
    } catch (error) {
      console.error('Erreur DevisService.getDevisById:', error);
      throw new Error(`Erreur lors de la récupération du devis: ${error.message}`);
    }
  }

  async createDevis(devisData) {
    try {
      // Validation des données requises
      if (!devisData.tiers_id || !devisData.date_devis) {
        throw new Error('Le client et la date sont obligatoires');
      }

      return await this.devisRepository.create(devisData);
    } catch (error) {
      console.error('Erreur DevisService.createDevis:', error);
      throw new Error(`Erreur lors de la création du devis: ${error.message}`);
    }
  }

  async updateDevis(id_devis, devisData) {
    try {
      // Vérifier que le devis existe
      const existingDevis = await this.devisRepository.findById(id_devis);
      if (!existingDevis) {
        throw new Error('Devis non trouvé');
      }

      return await this.devisRepository.update(id_devis, devisData);
    } catch (error) {
      console.error('Erreur DevisService.updateDevis:', error);
      throw new Error(`Erreur lors de la mise à jour du devis: ${error.message}`);
    }
  }

  async updateDevisStatut(id_devis, statut) {
    try {
      const statutsValides = ['brouillon', 'envoye', 'accepte', 'refuse', 'expire'];
      if (!statutsValides.includes(statut)) {
        throw new Error('Statut invalide');
      }

      const existingDevis = await this.devisRepository.findById(id_devis);
      if (!existingDevis) {
        throw new Error('Devis non trouvé');
      }

      return await this.devisRepository.updateStatut(id_devis, statut);
    } catch (error) {
      console.error('Erreur DevisService.updateDevisStatut:', error);
      throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
    }
  }

  async getDevisStats() {
    try {
      return await this.devisRepository.getStats();
    } catch (error) {
      console.error('Erreur DevisService.getDevisStats:', error);
      throw new Error('Erreur lors du calcul des statistiques des devis');
    }
  }

  async getDevisByStatut(statut) {
    try {
      const allDevis = await this.devisRepository.findAll();
      return allDevis.filter(devis => devis.statut === statut);
    } catch (error) {
      console.error('Erreur DevisService.getDevisByStatut:', error);
      throw new Error('Erreur lors du filtrage des devis par statut');
    }
  }

  // À créer : src/modules/crm/services/DevisService.js
async transformerDevisEnContrat(id_devis, donneesContrat) {
  try {
    const devis = await this.devisRepository.findById(id_devis);
    
    if (!devis) {
      throw new Error('Devis non trouvé');
    }
    
    if (devis.statut !== 'accepte') {
      throw new Error('Seuls les devis acceptés peuvent être transformés en contrat');
    }
    
    // Générer numéro contrat
    const dernierContrat = await this.contratRepository.findLast();
    const nouveauNumero = this.genererNumeroContrat(dernierContrat);
    
    const contratData = {
      numero_contrat: nouveauNumero,
      tiers_id: devis.tiers_id,
      devis_id: id_devis,
      type_contrat: donneesContrat.type_contrat || 'maintenance',
      date_debut: donneesContrat.date_debut || new Date(),
      date_fin: donneesContrat.date_fin,
      montant_ht: devis.montant_ht,
      periodicite: donneesContrat.periodicite,
      description: donneesContrat.description,
      conditions: devis.conditions
    };
    
    return await this.contratRepository.create(contratData);
  } catch (error) {
    console.error('Erreur transformation devis en contrat:', error);
    throw error;
  }
}
}

export default DevisService;
