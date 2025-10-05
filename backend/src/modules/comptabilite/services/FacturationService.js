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

  // Créer une facture complète avec ses lignes
  async creerFacture(factureData) {
    try {
      // Vérifier que le tiers existe
      const tiers = await this.tiersRepository.findById(factureData.id_tiers);
      if (!tiers) {
        throw new Error('Tiers non trouvé');
      }

      // Générer le numéro de facture
      const numero_facture = await this.factureRepository.getNextNumero();

      // Préparer les données de la facture
      const facture = {
        numero_facture,
        date: factureData.date || new Date().toISOString().split('T')[0],
        type_facture: factureData.type_facture,
        id_tiers: factureData.id_tiers,
        echeance: factureData.echeance,
        reglement: factureData.reglement,
        statut: 'brouillon',
        total_ht: 0,
        total_tva: 0,
        total_ttc: 0
      };

      // Créer la facture
      const nouvelleFacture = await this.factureRepository.create(facture);

      // Traiter les lignes de facture
      const lignesAvecCalculs = await this.processLignesFacture(
        numero_facture, 
        factureData.lignes || []
      );

      // Calculer les totaux
      const totaux = this.calculService.calculerTotauxFacture(lignesAvecCalculs);

      // Mettre à jour la facture avec les totaux
      await this.factureRepository.update(numero_facture, totaux);

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

  // Traiter les lignes de facture
  async processLignesFacture(numero_facture, lignes) {
    const lignesTraitees = [];

    for (const ligne of lignes) {
      let article = null;
      
      // Si un code article est fourni, récupérer l'article
      if (ligne.code_article) {
        article = await this.articleRepository.findByCode(ligne.code_article);
        if (!article) {
          throw new Error(`Article ${ligne.code_article} non trouvé`);
        }
      }

      // Préparer les données de la ligne
      const ligneData = {
        numero_facture,
        code_article: ligne.code_article,
        description: ligne.description || (article ? article.description : ''),
        quantite: ligne.quantite,
        prix_unitaire: ligne.prix_unitaire || (article ? article.prix_unitaire : 0),
        taux_tva: ligne.taux_tva || (article ? article.taux_tva : 20),
        remise: ligne.remise || 0
      };

      // Calculer les montants
      const montants = this.calculService.calculerLigneFacture(ligneData);
      
      const ligneComplete = {
        ...ligneData,
        ...montants
      };

      // Créer la ligne en base
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

      // Vérifier qu'il y a des lignes
      const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);
      if (lignes.length === 0) {
        throw new Error('Impossible de valider une facture sans lignes');
      }

      // Valider la facture
      await this.factureRepository.valider(numero_facture);

      return {
        message: 'Facture validée avec succès',
        facture: {
          ...facture,
          statut: 'validee',
          lignes
        }
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

  // Générer un numéro de facture
  async genererNumeroFacture() {
    return await this.factureRepository.getNextNumero();
  }
}

export default FacturationService;        