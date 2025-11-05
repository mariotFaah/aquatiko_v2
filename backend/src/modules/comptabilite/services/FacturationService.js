import { TiersRepository } from '../repositories/TiersRepository.js';
import { ArticleRepository } from '../repositories/ArticleRepository.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { LigneFactureRepository } from '../repositories/LigneFactureRepository.js';
import { CalculService } from './CalculService.js';
import { ArticleService } from './ArticleService.js';

export class FacturationService {
  constructor() {
    this.tiersRepository = new TiersRepository();
    this.articleRepository = new ArticleRepository();
    this.factureRepository = new FactureRepository();
    this.ligneFactureRepository = new LigneFactureRepository();
    this.calculService = new CalculService();
    this.articleService = new ArticleService();
  }

  async verifierStockAvantCreation(factureData) {
  const lignes = factureData.lignes || [];
  const erreurs = [];

  for (const ligne of lignes) {
    if (!ligne.code_article) continue;

    try {
      const article = await this.articleService.getArticleByCode(ligne.code_article);
      
      if (article && article.statut_stock === 'rupture') {
        erreurs.push(`Article ${ligne.code_article} en rupture de stock`);
      }

      if (article && article.quantite_stock < ligne.quantite) {
        erreurs.push(
          `Stock insuffisant pour ${ligne.code_article}: ` +
          `${ligne.quantite} demandé, ${article.quantite_stock} disponible`
        );
      }
    } catch (error) {
      erreurs.push(`Erreur vérification ${ligne.code_article}: ${error.message}`);
    }
  }

  return erreurs;
}

  // Créer une facture complète avec ses lignes - VERSION MULTI-DEVISE

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

    // ✅ SEULEMENT pour les factures validées : vérifier et décrémenter le stock
    await this.verifierStockFacture(lignes);
    await this.decrementerStockFacture(lignes, numero_facture);

    // Marquer la facture comme validée
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

  // AJOUT: Vérifier le stock avant validation
  async verifierStockFacture(lignes) {
    const erreurs = [];

    for (const ligne of lignes) {
      if (!ligne.code_article) continue; // Ignorer les lignes sans article

      try {
        const article = await this.articleService.getArticleByCode(ligne.code_article);
        
        if (!article) {
          erreurs.push(`Article ${ligne.code_article} non trouvé`);
          continue;
        }

        // Vérifier si l'article est en rupture
        if (article.statut_stock === 'rupture') {
          erreurs.push(`Article ${ligne.code_article} est en rupture de stock`);
        }

        // Vérifier si la quantité demandée dépasse le stock disponible
        const stockDisponible = article.quantite_stock || 0;
        if (stockDisponible < ligne.quantite) {
          erreurs.push(
            `Stock insuffisant pour ${ligne.code_article}: ` +
            `${ligne.quantite} demandé, ${stockDisponible} disponible`
          );
        }
      } catch (error) {
        erreurs.push(`Erreur vérification ${ligne.code_article}: ${error.message}`);
      }
    }

    if (erreurs.length > 0) {
      throw new Error(`Problèmes de stock: ${erreurs.join(', ')}`);
    }
  }

  // AJOUT: Décrémenter le stock après validation
  async decrementerStockFacture(lignes, numero_facture) {
    try {
      for (const ligne of lignes) {
        if (!ligne.code_article) continue; // Ignorer les lignes sans article

        await this.articleService.adjustStock(
          ligne.code_article,
          -ligne.quantite, // Négatif pour décrémenter
          `Vente facture ${numero_facture}`
        );
        
        console.log(`✅ Stock décrémenté: ${ligne.code_article} -${ligne.quantite}`);
      }
    } catch (error) {
      console.error('Erreur lors de la décrémentation du stock:', error);
      throw new Error(`Erreur stock: ${error.message}`);
    }
  }

  // AJOUT: Annuler une facture et réapprovisionner le stock
  async annulerFacture(numero_facture) {
  try {
    const facture = await this.factureRepository.findById(numero_facture);
    
    if (!facture) {
      throw new Error('Facture non trouvée');
    }

    if (facture.statut !== 'validee') {
      throw new Error('Seules les factures validées peuvent être annulées');
    }

    const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);

    // ✅ SEULEMENT pour les factures validées qu'on annule : réapprovisionner le stock
    await this.reapprovisionnerStockFacture(lignes, numero_facture);

    // Marquer la facture comme annulée
    await this.factureRepository.update(numero_facture, {
      statut: 'annulee',
      updated_at: new Date()
    });

    const factureAnnulee = await this.factureRepository.findById(numero_facture);
    
    return {
      ...factureAnnulee,
      lignes,
      statut: 'annulee'
    };

  } catch (error) {
    console.error('Erreur FacturationService.annulerFacture:', error);
    throw new Error(`Erreur lors de l'annulation de la facture: ${error.message}`);
  }
}


  // AJOUT: Réapprovisionner le stock lors de l'annulation
  async reapprovisionnerStockFacture(lignes, numero_facture) {
    try {
      for (const ligne of lignes) {
        if (!ligne.code_article) continue;

        await this.articleService.adjustStock(
          ligne.code_article,
          ligne.quantite, // Positif pour réapprovisionner
          `Annulation facture ${numero_facture}`
        );
        
        console.log(`✅ Stock réapprovisionné: ${ligne.code_article} +${ligne.quantite}`);
      }
    } catch (error) {
      console.error('Erreur lors du réapprovisionnement du stock:', error);
      throw new Error(`Erreur stock: ${error.message}`);
    }
  }
  async creerFacture(factureData) {
  try {
    // Vérifier que le tiers existe
    const tiers = await this.tiersRepository.findById(factureData.id_tiers);
    if (!tiers) {
      throw new Error('Tiers non trouvé');
    }

    // ✅ Vérification du stock UNIQUEMENT si création directe en statut "validée"
    if (factureData.statut === 'validee') {
      const erreursStock = await this.verifierStockAvantCreation(factureData);
      if (erreursStock.length > 0) {
        throw new Error(`Problèmes de stock: ${erreursStock.join(', ')}`);
      }
    }

    // Générer le numéro de facture
    const numero_facture = await this.factureRepository.getNextNumero();

    const facture = {
      numero_facture,
      date: factureData.date || new Date().toISOString().split('T')[0],
      type_facture: factureData.type_facture,
      id_tiers: factureData.id_tiers,
      echeance: factureData.echeance,
      reglement: factureData.reglement,
      statut: factureData.statut || 'brouillon', // Par défaut brouillon
      total_ht: factureData.total_ht || 0,
      total_tva: factureData.total_tva || 0,
      total_ttc: factureData.total_ttc || 0,
      devise: factureData.devise || 'MGA',
      taux_change: factureData.taux_change || 1.0,
      notes: factureData.notes || null
    };

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
      
      await this.factureRepository.updateTotals(numero_facture, {
        totalHT: totaux.totalHT,
        totalTVA: totaux.totalTVA, 
        totalTTC: totaux.totalTTC
      });
    }

    // ✅ Décrémenter le stock UNIQUEMENT si création directe en statut "validée"
    if (factureData.statut === 'validee') {
      const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);
      await this.decrementerStockFacture(lignes, numero_facture);
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
    const factureExistante = await this.getFacture(numeroFacture);
    if (!factureExistante) {
      throw new Error('Facture non trouvée');
    }

    const { lignes, ...factureUpdate } = factureData;

    // ✅ Gestion spéciale du changement de statut
    if (factureUpdate.statut) {
      await this.gererChangementStatut(numeroFacture, factureExistante.statut, factureUpdate.statut, lignes);
    }

    const factureModifiee = await this.factureRepository.update(numeroFacture, factureUpdate);

    if (lignes && Array.isArray(lignes)) {
      await this.ligneFactureRepository.deleteByFacture(numeroFacture);
      await this.processLignesFacture(numeroFacture, lignes, factureData.devise || 'MGA');
    }

    await this.calculerTotalsFacture(numeroFacture);

    return await this.getFactureComplete(numeroFacture);

  } catch (error) {
    console.error('❌ Erreur FacturationService.updateFacture:', error);
    throw new Error('Erreur lors de la mise à jour de la facture: ' + error.message);
  }
}

async gererChangementStatut(numeroFacture, ancienStatut, nouveauStatut, lignes) {
  // Cas 1: Brouillon → Validée : Décrémenter le stock
  if (ancienStatut === 'brouillon' && nouveauStatut === 'validee') {
    const lignesFacture = lignes || await this.ligneFactureRepository.findByFacture(numeroFacture);
    await this.verifierStockFacture(lignesFacture);
    await this.decrementerStockFacture(lignesFacture, numeroFacture);
  }
  
  // Cas 2: Validée → Annulée : Réapprovisionner le stock
  else if (ancienStatut === 'validee' && nouveauStatut === 'annulee') {
    const lignesFacture = lignes || await this.ligneFactureRepository.findByFacture(numeroFacture);
    await this.reapprovisionnerStockFacture(lignesFacture, numeroFacture);
  }
  
  // Cas 3: Annulée → Validée : Décrémenter à nouveau le stock
  else if (ancienStatut === 'annulee' && nouveauStatut === 'validee') {
    const lignesFacture = lignes || await this.ligneFactureRepository.findByFacture(numeroFacture);
    await this.verifierStockFacture(lignesFacture);
    await this.decrementerStockFacture(lignesFacture, numeroFacture);
  }
  
  // Autres cas (Brouillon → Annulée, etc.) : Aucun impact sur le stock
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