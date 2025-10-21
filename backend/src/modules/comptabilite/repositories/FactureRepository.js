import { db } from '../../../core/database/connection.js';

export class FactureRepository {
  
  // Récupérer toutes les factures avec les infos du tiers
  async findAll() {
    try {
      const factures = await db('factures as f')
        .join('tiers as t', 'f.id_tiers', 't.id_tiers')
        .select(
          'f.numero_facture',
          'f.date',
          'f.type_facture',
          'f.echeance',
          'f.reglement',
          'f.total_ht',
          'f.total_tva',
          'f.total_ttc',
          'f.statut',
          'f.devise',
          'f.taux_change',
          'f.notes',
          'f.created_at',
          't.nom as nom_tiers',
          't.type_tiers'
        )
        .orderBy('f.created_at', 'desc');
      
      return factures;
    } catch (error) {
      console.error('Erreur FactureRepository.findAll:', error);
      throw new Error('Erreur lors de la récupération des factures');
    }
  }

  // Récupérer une facture par ID avec détails
  // Dans FactureRepository.js - CORRIGER la méthode findById
// Récupérer une facture par ID avec détails
async findById(numero_facture) {
  try {
    console.log('🔍 Recherche facture avec:', numero_facture);
    
    // CONVERSION EXPLICITE
    const num = parseInt(numero_facture);
    if (isNaN(num)) {
      throw new Error(`Numéro de facture invalide: ${numero_facture}`);
    }
    
    console.log('🔍 Numéro converti:', num);
    
    // APPROCHE 1: Requête très simple d'abord
    console.log('🔍 Test requête simple...');
    const factureSimple = await db('factures')
      .where('numero_facture', num)
      .first();
    
    console.log('✅ Résultat requête simple:', !!factureSimple);
    
    if (!factureSimple) {
      return null;
    }
    
    // APPROCHE 2: Maintenant avec le JOIN
    console.log('🔍 Test requête avec JOIN...');
    const factureComplete = await db('factures')
      .join('tiers', 'factures.id_tiers', 'tiers.id_tiers')
      .select(
        'factures.*',
        'tiers.nom as nom_tiers',
        'tiers.adresse',
        'tiers.email',
        'tiers.telephone',
        'tiers.devise_preferee'
      )
      .where('factures.numero_facture', num)
      .first();
    
    console.log('✅ Résultat requête JOIN:', !!factureComplete);
    
    return factureComplete;
    
  } catch (error) {
    console.error('❌ Erreur FactureRepository.findById:', error);
    console.error('❌ Stack:', error.stack);
    throw new Error('Erreur lors de la récupération de la facture: ' + error.message);
  }
}

  // Créer une nouvelle facture
  async create(factureData) {
    try {
      const [numero_facture] = await db('factures').insert(factureData);
      
      const nouvelleFacture = await this.findById(numero_facture);
      return nouvelleFacture;
    } catch (error) {
      console.error('Erreur FactureRepository.create:', error);
      throw new Error('Erreur lors de la création de la facture');
    }
  }

  // Mettre à jour une facture
  

  // Valider une facture
  async valider(numero_facture) {
    try {
      await db('factures')
        .where('numero_facture', numero_facture)
        .update({
          statut: 'validée',
          updated_at: new Date()
        });
      
      return { message: 'Facture validée avec succès' };
    } catch (error) {
      console.error('Erreur FactureRepository.valider:', error);
      throw new Error('Erreur lors de la validation de la facture');
    }
  }

  // Récupérer le prochain numéro de facture
  async getNextNumero() {
    try {
      const result = await db('factures')
        .max('numero_facture as max_numero')
        .first();
      
      return (result.max_numero || 0) + 1;
    } catch (error) {
      console.error('Erreur FactureRepository.getNextNumero:', error);
      throw new Error('Erreur lors de la génération du numéro de facture');
    }
  }

  // NOUVELLES MÉTHODES POUR LES STATUTS DE PAIEMENT
  async findByStatut(statut) {
    try {
      const factures = await db('factures as f')
        .join('tiers as t', 'f.id_tiers', 't.id_tiers')
        .select(
          'f.numero_facture',
          'f.date',
          'f.type_facture',
          'f.total_ttc',
          'f.statut',
          'f.devise',
          't.nom as nom_tiers'
        )
        .where('f.statut', statut)
        .orderBy('f.date', 'asc');
      
      return factures;
    } catch (error) {
      console.error('Erreur FactureRepository.findByStatut:', error);
      throw new Error('Erreur lors de la récupération des factures par statut');
    }
  }

  // Mettre à jour le statut
 async update(req, res) {
  try {
    // CORRECTION: Utiliser req.params.id au lieu de req.params.numero
    const numero = req.params.id;
    const factureData = req.body;

    console.log('🔄 Données reçues pour modification:', factureData);
    console.log('🔍 Numéro facture depuis params:', numero);
    console.log('🔍 Type du numéro:', typeof numero);

    // Valider que la facture existe
    const factureExistante = await this.factureRepository.findById(numero);
    if (!factureExistante) {
      return res.status(404).json({
        success: false,
        message: 'Facture non trouvée'
      });
    }

    // Mettre à jour la facture via le service
    const factureModifiee = await this.facturationService.updateFacture(numero, factureData);

    // Utiliser successResponse pour la cohérence
    successResponse(res, factureModifiee, 'Facture modifiée avec succès');

  } catch (error) {
    console.error('❌ Erreur modification facture:', error);
    errorResponse(res, error.message);
  }
}

   // AJOUTER CETTE MÉTHODE
  query() {
    return db('factures');
  }

  // AJOUTER CETTE MÉTHODE MANQUANTE
  async findByNumero(numero_facture) {
    try {
      const facture = await db('factures as f')
        .join('tiers as t', 'f.id_tiers', 't.id_tiers')
        .select(
          'f.*',
          't.nom as nom_tiers',
          't.adresse',
          't.email',
          't.telephone',
          't.devise_preferee'
        )
        .where('f.numero_facture', numero_facture)
        .first();
      
      return facture;
    } catch (error) {
      console.error('Erreur FactureRepository.findByNumero:', error);
      throw new Error('Erreur lors de la récupération de la facture');
    }
  }

  // AJOUTER CETTE MÉTHODE POUR RAPPORT SERVICE
  async getFacturesByPeriode(date_debut, date_fin) {
    try {
      let query = db('factures');
      
      if (date_debut) {
        query = query.where('date', '>=', date_debut);
      }
      
      if (date_fin) {
        query = query.where('date', '<=', date_fin);
      }
      
      const result = await query.sum('total_ttc as total');
      return result[0];
    } catch (error) {
      console.error('Erreur FactureRepository.getFacturesByPeriode:', error);
      throw new Error('Erreur lors du calcul des factures par période');
    }
  }
  // Dans FactureRepository.js - CORRIGER la méthode update
async update(numeroFacture, factureData) {
  try {
    // Filtrer les champs qui existent vraiment dans la table factures
    const champsPermis = [
      'date', 'type_facture', 'id_tiers', 'echeance', 
      'reglement', 'statut', 'notes', 'devise', 'taux_change'
    ];
    
    const donneesMiseAJour = {};
    
    for (const [champ, valeur] of Object.entries(factureData)) {
      if (champsPermis.includes(champ)) {
        donneesMiseAJour[champ] = valeur;
      }
    }
    
    donneesMiseAJour.updated_at = new Date();
    
    console.log('🔄 Mise à jour facture en base:', { numeroFacture, donneesMiseAJour });
    
    // CORRECTION: Utiliser db directement au lieu de this.db
    const result = await db('factures')
      .where({ numero_facture: numeroFacture })
      .update(donneesMiseAJour);
    
    if (result === 0) {
      throw new Error('Facture non trouvée');
    }
    
    return await this.findById(numeroFacture);
    
  } catch (error) {
    console.error('❌ Erreur FactureRepository.update:', error);
    throw error;
  }
}


// Après la méthode update existante, ajoutez :

// Dans FactureRepository.js - méthode updateTotals
async updateTotals(numeroFacture, totals) {
  try {
    console.log('💰 Mise à jour BDD des totaux:', { numeroFacture, totals });
    
    const result = await db('factures')
      .where('numero_facture', numeroFacture)
      .update({
        total_ht: totals.totalHT,
        total_tva: totals.totalTVA,
        total_ttc: totals.totalTTC,
        updated_at: new Date()
      });
    
    console.log('✅ Résultat mise à jour BDD:', result);
    return result > 0;
    
  } catch (error) {
    console.error('❌ Erreur BDD updateTotals:', error);
    throw error;
  }
}

// Avant les méthodes deleteLignesFacture et addLigneFacture
// CORRECTION: Méthodes deleteLignesFacture et addLigneFacture
async deleteLignesFacture(numeroFacture) {
  try {
    const result = await db('lignes_facture') // CORRECTION: db au lieu de this.db
      .where({ numero_facture: numeroFacture })
      .delete();
    
    console.log(`🗑️ ${result} lignes supprimées pour la facture ${numeroFacture}`);
    
  } catch (error) {
    console.error('❌ Erreur suppression lignes:', error);
    throw error;
  }
}

async addLigneFacture(ligneData) {
  try {
    const [id] = await db('lignes_facture').insert(ligneData); // CORRECTION: db au lieu de this.db
    console.log(`✅ Ligne ajoutée avec ID: ${id}`);
    return id;
  } catch (error) {
    console.error('❌ Erreur ajout ligne:', error);
    throw error;
  }
}

// Ajoutez cette méthode temporaire dans FactureRepository
async testDirectQuery() {
  try {
    console.log('🧪 Test de requête directe...');
    
    // Test 1: Requête SQL directe
    const directResult = await db.raw('SELECT * FROM factures WHERE numero_facture = ?', [12]);
    console.log('📊 Résultat direct SQL:', directResult[0].length > 0 ? 'Trouvé' : 'Non trouvé');
    
    // Test 2: Requête Knex simple
    const knexResult = await db('factures').where('numero_facture', 12).first();
    console.log('📊 Résultat Knex simple:', !!knexResult);
    
    // Test 3: Vérifier le schéma
    const schema = await db.raw('DESCRIBE factures');
    const columns = schema[0].map(col => col.Field);
    console.log('🔍 Colonnes disponibles:', columns);
    console.log('🔍 numero_facture existe:', columns.includes('numero_facture'));
    
    return true;
  } catch (error) {
    console.error('❌ Test échoué:', error);
    return false;
  }
}

}

export default FactureRepository;