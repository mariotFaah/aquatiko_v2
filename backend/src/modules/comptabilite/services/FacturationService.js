import { TiersRepository } from '../repositories/TiersRepository.js';
import { ArticleRepository } from '../repositories/ArticleRepository.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { LigneFactureRepository } from '../repositories/LigneFactureRepository.js';
import { CalculService } from './CalculService.js';

export class FacturationService {
  constructor() {
    this.tiersRepository = new TiersRepository();
    this.articleRepository = new ArticleRepository();
    this.factureRepository = new FactureRepository();
    this.ligneFactureRepository = new LigneFactureRepository();
    this.calculService = new CalculService();
  }

  // Créer une facture complète avec ses lignes - VERSION MULTI-DEVISE
  async creerFacture(factureData) {
    try {
      // Vérifier que le tiers existe
      const tiers = await this.tiersRepository.findById(factureData.id_tiers);
      if (!tiers) {
        throw new Error('Tiers non trouvé');
      }

      // Générer le numéro de facture
      const numero_facture = await this.factureRepository.getNextNumero();

      // Utiliser les données reçues avec support multi-devise
      const facture = {
        numero_facture,
        date: factureData.date || new Date().toISOString().split('T')[0],
        type_facture: factureData.type_facture,
        id_tiers: factureData.id_tiers,
        echeance: factureData.echeance,
        reglement: factureData.reglement,
        statut: factureData.statut || 'brouillon',
        total_ht: factureData.total_ht || 0,
        total_tva: factureData.total_tva || 0,
        total_ttc: factureData.total_ttc || 0,
        devise: factureData.devise || 'MGA',
        taux_change: factureData.taux_change || 1.0,
        notes: factureData.notes || null
      };

      console.log('📝 Données facture à créer (multi-devise):', facture);

      // Créer la facture
      const nouvelleFacture = await this.factureRepository.create(facture);

      // Traiter les lignes de facture
      const lignesAvecCalculs = await this.processLignesFacture(
        numero_facture, 
        factureData.lignes || [],
        factureData.devise || 'MGA'
      );

      // Si les totaux n'étaient pas fournis, les calculer
      if (!factureData.total_ht || !factureData.total_tva || !factureData.total_ttc) {
        const totaux = this.calculService.calculerTotauxFacture(lignesAvecCalculs);
        
        // Mettre à jour la facture avec les totaux calculés
        await this.factureRepository.updateTotals(numero_facture, {
          totalHT: totaux.totalHT,
          totalTVA: totaux.totalTVA, 
          totalTTC: totaux.totalTTC
        });
      }

      // Récupérer la facture complète
      const factureComplete = await this.factureRepository.findById(numero_facture);
      const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);

      return {
        ...factureComplete,
        lignes
      };

    } catch (error) {
      console.error('Erreur FacturationService.creerFacture:', error);
      throw new Error(`Erreur lors de la création de la facture: ${error.message}`);
    }
  }

  // Traiter les lignes de facture avec support multi-devise
  async processLignesFacture(numero_facture, lignes, deviseFacture = 'MGA') {
    const lignesTraitees = [];

    for (const ligne of lignes) {
      let article = null;
      
      if (ligne.code_article) {
        article = await this.articleRepository.findByCode(ligne.code_article);
        if (!article) {
          throw new Error(`Article ${ligne.code_article} non trouvé`);
        }
      }

      // Les prix unitaires sont dans la devise de la facture
      const ligneData = {
        numero_facture,
        code_article: ligne.code_article,
        description: ligne.description || (article ? article.description : ''),
        quantite: ligne.quantite,
        prix_unitaire: ligne.prix_unitaire || (article ? article.prix_unitaire : 0),
        taux_tva: ligne.taux_tva || (article ? article.taux_tva : 20),
        remise: ligne.remise || 0
      };

      const montants = this.calculService.calculerLigneFacture(ligneData);
      
      const ligneComplete = {
        ...ligneData,
        ...montants
      };

      await this.ligneFactureRepository.create(ligneComplete);
      lignesTraitees.push(ligneComplete);
    }

    return lignesTraitees;
  }

  // Valider une facture
  async validerFacture(numero_facture) {
    try {
      const facture = await this.factureRepository.findById(numero_facture);
      
      if (!facture) {
        throw new Error('Facture non trouvée');
      }

      if (facture.statut === 'validee') {
        throw new Error('La facture est déjà validée');
      }

      const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);
      if (lignes.length === 0) {
        throw new Error('Impossible de valider une facture sans lignes');
      }

      await this.factureRepository.valider(numero_facture);

      const factureValidee = await this.factureRepository.findById(numero_facture);
      
      return {
        ...factureValidee,
        lignes,
        statut: 'validee'
      };

    } catch (error) {
      console.error('Erreur FacturationService.validerFacture:', error);
      throw new Error(`Erreur lors de la validation de la facture: ${error.message}`);
    }
  }

  // Récupérer une facture complète avec ses lignes
  async getFactureComplete(numero_facture) {
    try {
      const facture = await this.factureRepository.findById(numero_facture);
      
      if (!facture) {
        throw new Error('Facture non trouvée');
      }

      const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);

      return {
        ...facture,
        lignes
      };

    } catch (error) {
      console.error('Erreur FacturationService.getFactureComplete:', error);
      throw new Error(`Erreur lors de la récupération de la facture: ${error.message}`);
    }
  }

  // Récupérer une facture (alias de getFactureById pour compatibilité)
  async getFacture(numero_facture) {
    try {
      return await this.getFactureById(numero_facture);
    } catch (error) {
      console.error('❌ Erreur getFacture:', error);
      throw error;
    }
  }

  // Récupérer toutes les factures
  async getFactures() {
    try {
      return await this.factureRepository.findAll();
    } catch (error) {
      console.error('Erreur FacturationService.getFactures:', error);
      throw new Error('Erreur lors de la récupération des factures');
    }
  }

  // Récupérer une facture par ID
  async getFactureById(numero_facture) {
    try {
      const facture = await this.factureRepository.findById(numero_facture);
      
      if (!facture) {
        throw new Error('Facture non trouvée');
      }

      return facture;
    } catch (error) {
      console.error('Erreur FacturationService.getFactureById:', error);
      throw new Error(`Erreur lors de la récupération de la facture: ${error.message}`);
    }
  }

  // Mettre à jour une facture 
  async updateFacture(numeroFacture, factureData) {
    try {
      console.log('📝 Mise à jour facture:', numeroFacture, factureData);

      const factureExistante = await this.getFacture(numeroFacture);
      if (!factureExistante) {
        throw new Error('Facture non trouvée');
      }

      const { lignes, ...factureUpdate } = factureData;

      const factureModifiee = await this.factureRepository.update(numeroFacture, factureUpdate);

      if (lignes && Array.isArray(lignes)) {
        

        await this.ligneFactureRepository.deleteByFacture(numeroFacture);

        const lignesAvecCalculs = await this.processLignesFacture(
          numeroFacture, 
          lignes,
          factureData.devise || 'MGA'
        );
        
      }

      await this.calculerTotalsFacture(numeroFacture);

      return await this.getFactureComplete(numeroFacture);

    } catch (error) {
      console.error('❌ Erreur FacturationService.updateFacture:', error);
      throw new Error('Erreur lors de la mise à jour de la facture: ' + error.message);
    }
  }

  // Calculer les totaux d'une facture - VERSION CORRIGÉE
  async calculerTotalsFacture(numero_facture) {
    try {
      const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);
      
      let totalHT = 0;
      let totalTVA = 0;
      let totalTTC = 0;

      for (const ligne of lignes) {
        totalHT += parseFloat(ligne.montant_ht) || 0;
        totalTVA += parseFloat(ligne.montant_tva) || 0;
        totalTTC += parseFloat(ligne.montant_ttc) || 0;
      }

      console.log(`💰 Totaux calculés pour facture ${numero_facture}: HT=${totalHT}, TVA=${totalTVA}, TTC=${totalTTC}`);

      const result = await this.factureRepository.updateTotals(numero_facture, {
        totalHT: totalHT,
        totalTVA: totalTVA,
        totalTTC: totalTTC
      });

      return { totalHT, totalTVA, totalTTC };
      
    } catch (error) {
      console.error('❌ Erreur calculTotalsFacture:', error);
      throw error;
    }
  }

  // Générer un numéro de facture
  async genererNumeroFacture() {
    return await this.factureRepository.getNextNumero();
  }
}

export default FacturationService;