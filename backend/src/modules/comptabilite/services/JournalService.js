// src/modules/comptabilite/services/JournalService.js 
import { EcritureComptableRepository } from '../repositories/EcritureComptableRepository.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { PaiementRepository } from '../repositories/PaiementRepository.js';
import { TiersRepository } from '../repositories/TiersRepository.js';
import { PlanComptableRepository } from '../repositories/PlanComptableRepository.js';
import { ReferentielRepository } from '../repositories/ReferentielRepository.js';
import { db } from '../../../core/database/connection.js';

export class JournalService {
  constructor() {
    this.ecritureRepo = new EcritureComptableRepository();
    this.factureRepo = new FactureRepository();
    this.paiementRepo = new PaiementRepository();
    this.tiersRepo = new TiersRepository();
    this.planComptableRepo = new PlanComptableRepository();
    this.referentielRepo = new ReferentielRepository();
  }

  async genererEcritureFacture(facture) {
    try {
     
      
      const typeTiers = await this.getTypeTiers(facture.id_tiers);
      
      const isAchat = typeTiers === 'fournisseur';
      const journal = isAchat ? 'achats' : 'ventes';

      // RÉCUPÉRATION DYNAMIQUE DES COMPTES
      const compteTiers = await this.planComptableRepo.findByCategorie(isAchat ? 'fournisseur' : 'client');
      const compteTVA = await this.planComptableRepo.findByCategorie('tva');
      const compteProduit = await this.planComptableRepo.findByCategorie(isAchat ? 'achat' : 'vente');

      if (!compteTiers || !compteTVA || !compteProduit) {
        console.error('❌ Configuration comptable incomplète');
        throw new Error('Configuration comptable incomplète. Vérifiez le plan comptable.');
      }

      console.log('💰 Comptes dynamiques récupérés:', {
        compteTiers: compteTiers.numero_compte,
        compteTVA: compteTVA.numero_compte,
        compteProduit: compteProduit.numero_compte
      });

      const ecritures = [];
      const date = new Date(facture.date);
      const prefix = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
      
    
      ecritures.push({
        numero_ecriture: `${prefix}-${facture.numero_facture}-1`,
        date: facture.date,
        journal: journal,
        compte: compteTiers.numero_compte,
        libelle: `Facture ${facture.numero_facture} - ${facture.nom_tiers || ''}`,
        //  Clients -> DÉBIT (ils nous doivent), Fournisseurs -> CRÉDIT (nous leur devons)
        debit: isAchat ? 0 : facture.total_ttc,      // Clients: débit, Fournisseurs: 0
        credit: isAchat ? facture.total_ttc : 0,     // Clients: 0, Fournisseurs: crédit
        devise: facture.devise || 'MGA',
        taux_change: facture.taux_change || 1,
        reference: facture.numero_facture.toString()
      });

      // Écriture TVA
      if (facture.total_tva > 0) {
        ecritures.push({
          numero_ecriture: `${prefix}-${facture.numero_facture}-2`,
          date: facture.date,
          journal: journal,
          compte: compteTVA.numero_compte,
          libelle: `TVA Facture ${facture.numero_facture}`,
          //  TVA déductible (achats) -> DÉBIT, TVA collectée (ventes) -> CRÉDIT
          debit: isAchat ? facture.total_tva : 0,    // Achats: débit, Ventes: 0
          credit: isAchat ? 0 : facture.total_tva,   // Achats: 0, Ventes: crédit
          devise: facture.devise || 'MGA',
          taux_change: facture.taux_change || 1,
          reference: facture.numero_facture.toString()
        });
      }

      //  Écriture produit/charge
      ecritures.push({
        numero_ecriture: `${prefix}-${facture.numero_facture}-3`,
        date: facture.date,
        journal: journal,
        compte: compteProduit.numero_compte,
        libelle: `Facture ${facture.numero_facture}`,
        //  Charges (achats) -> DÉBIT, Produits (ventes) -> CRÉDIT
        debit: isAchat ? facture.total_ht : 0,    // Achats: débit, Ventes: 0
        credit: isAchat ? 0 : facture.total_ht,   // Achats: 0, Ventes: crédit
        devise: facture.devise || 'MGA',
        taux_change: facture.taux_change || 1,
        reference: facture.numero_facture.toString()
      });
      
      // Créer les écritures
      for (const ecriture of ecritures) {
        await this.ecritureRepo.create(ecriture);
      }
            
    } catch (error) {
      console.error('❌ Erreur génération écritures:', error);
      throw error;
    }
  }

  // MÉTHODE POUR RÉCUPÉRER LE TYPE DE TIERS
  async getTypeTiers(id_tiers) {
    try {
      const tiers = await this.tiersRepo.findById(id_tiers);
      return tiers ? tiers.type_tiers : 'client';
    } catch (error) {
      console.error('❌ Erreur récupération type tiers:', error);
      try {
        const tiers = await db('tiers')
          .where('id_tiers', id_tiers)
          .select('type_tiers')
          .first();
        return tiers ? tiers.type_tiers : 'client';
      } catch (dbError) {
        console.error('❌ Erreur DB récupération type tiers:', dbError);
        return 'client';
      }
    }
  }

  async genererEcriturePaiement(paiement) {
    try {
      
      const date = new Date();
      const prefix = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;

      const compte = await this.getCompteByModePaiement(paiement.mode_paiement);
      
      const ecriture = {
        numero_ecriture: `${prefix}-PAY-${paiement.id_paiement}`,
        date: paiement.date_paiement,
        journal: 'banque',
        compte: compte,
        libelle: `Paiement ${paiement.reference || paiement.id_paiement}`,
        debit: paiement.montant,
        credit: 0,
        devise: paiement.devise,
        taux_change: paiement.taux_change,
        reference: `PAY-${paiement.id_paiement}`
      };

      return await this.ecritureRepo.create(ecriture);
      
    } catch (error) {
      console.error('❌ Erreur génération écriture paiement:', error);
      throw error;
    }
  }

  async getCompteByModePaiement(mode_paiement) {
    try {
      const mapping = {
        'espece': 'caisse',
        'virement': 'banque',
        'cheque': 'banque', 
        'carte': 'banque'
      };
      
      const categorie = mapping[mode_paiement] || 'banque';
      const compte = await this.planComptableRepo.findByCategorie(categorie);
      
      if (!compte) {
        console.warn(`⚠️ Compte non trouvé pour catégorie: ${categorie}, utilisation du fallback`);
        return '512000';
      }
      
      return compte.numero_compte;
      
    } catch (error) {
      console.error('❌ Erreur récupération compte paiement:', error);
      return '512000';
    }
  }

  async verifierConfiguration() {
    try {
      const comptesRequises = ['client', 'fournisseur', 'tva', 'achat', 'vente', 'banque', 'caisse'];
      const resultats = {};
      
      for (const categorie of comptesRequises) {
        const compte = await this.planComptableRepo.findByCategorie(categorie);
        resultats[categorie] = compte ? {
          numero: compte.numero_compte,
          libelle: compte.libelle,
          ok: true
        } : {
          ok: false,
          erreur: `Compte manquant pour la catégorie: ${categorie}`
        };
      }
      
      return resultats;
    } catch (error) {
      console.error('❌ Erreur vérification configuration:', error);
      throw error;
    }
  }
}
