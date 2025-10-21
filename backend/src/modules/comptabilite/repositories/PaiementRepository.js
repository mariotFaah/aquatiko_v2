// src/modules/comptabilite/repositories/PaiementRepository.js
import { db } from '../../../core/database/connection.js';

export class PaiementRepository {
  
  // Récupérer tous les paiements d'une facture
  // Dans PaiementRepository.js - méthode findByFacture
  async findByFacture(numero_facture) {
    try {
      console.log('🔍 Recherche paiements pour facture:', numero_facture);
      
      const paiements = await db('paiements as p')
        .join('factures as f', 'p.numero_facture', 'f.numero_facture')
        .select(
          'p.*',
          'f.total_ttc',
          'f.devise as devise_facture'
        )
        .where('p.numero_facture', numero_facture) // CORRECTION: Utiliser le bon nom de colonne
        .orderBy('p.date_paiement', 'desc');
      
      console.log(`✅ ${paiements.length} paiement(s) trouvé(s) pour facture ${numero_facture}`);
      return paiements;
    } catch (error) {
      console.error('❌ Erreur PaiementRepository.findByFacture:', error);
      
      // CORRECTION: Solution de repli - requête simple sans JOIN
      try {
        console.log('🔄 Tentative de solution de repli...');
        const paiementsSimple = await db('paiements')
          .where('numero_facture', numero_facture)
          .orderBy('date_paiement', 'desc');
        
        console.log(`✅ ${paiementsSimple.length} paiement(s) trouvé(s) avec solution de repli`);
        return paiementsSimple;
      } catch (fallbackError) {
        console.error('❌ Erreur solution de repli:', fallbackError);
        throw new Error('Erreur lors de la récupération des paiements');
      }
    }
  }
  // Créer un nouveau paiement
  async create(paiementData) {
    try {
      const [id_paiement] = await db('paiements').insert(paiementData);
      
      const nouveauPaiement = await db('paiements')
        .where('id_paiement', id_paiement)
        .first();
      
      return nouveauPaiement;
    } catch (error) {
      console.error('Erreur PaiementRepository.create:', error);
      throw new Error('Erreur lors de la création du paiement');
    }
  }

  // Récupérer le total des paiements pour une facture
  async getTotalPaiementsFacture(numero_facture) {
    try {
      const result = await db('paiements')
        .where('numero_facture', numero_facture)
        .sum('montant as total')
        .first();
      
      return parseFloat(result.total) || 0;
    } catch (error) {
      console.error('Erreur PaiementRepository.getTotalPaiementsFacture:', error);
      throw new Error('Erreur lors du calcul du total des paiements');
    }
  }

  // Mettre à jour un paiement
  async update(id_paiement, data) {
    try {
      await db('paiements')
        .where('id_paiement', id_paiement)
        .update({
          ...data,
          updated_at: new Date()
        });
      
      return await this.findById(id_paiement);
    } catch (error) {
      console.error('Erreur PaiementRepository.update:', error);
      throw new Error('Erreur lors de la mise à jour du paiement');
    }
  }

  // Trouver par ID
  async findById(id_paiement) {
    try {
      return await db('paiements')
        .where('id_paiement', id_paiement)
        .first();
    } catch (error) {
      console.error('Erreur PaiementRepository.findById:', error);
      throw new Error('Erreur lors de la récupération du paiement');
    }
  }

  // Récupérer tous les paiements
  // Dans la méthode getPaiements du PaiementRepository.js
async getPaiements() {
  try {
    return await db('paiements as p')
      .join('factures as f', 'p.numero_facture', 'f.numero_facture')
      .join('tiers as t', 'f.id_tiers', 't.id_tiers') // <-- AJOUTER CETTE JOINTURE
      .select('p.*', 't.nom as nom_tiers'); // <-- CORRIGER ICI
  } catch (error) {
    console.error('Erreur PaiementRepository.getPaiements:', error);
    throw new Error('Erreur lors de la récupération des paiements');
  }
}

  // Récupérer les paiements par période
  async findByPeriode(date_debut, date_fin) {
    try {
      const paiements = await db('paiements as p')
        .join('factures as f', 'p.numero_facture', 'f.numero_facture')
        .join('tiers as t', 'f.id_tiers', 't.id_tiers')
        .select(
          'p.*',
          'f.type_facture',
          't.nom as nom_tiers'
        )
        .whereBetween('p.date_paiement', [date_debut, date_fin])
        .orderBy('p.date_paiement', 'desc');
      
      return paiements;
    } catch (error) {
      console.error('Erreur PaiementRepository.findByPeriode:', error);
      throw new Error('Erreur lors de la récupération des paiements par période');
    }
  }

  // Pour les rapports
  async getPaiementsByPeriode(date_debut, date_fin) {
    try {
      let query = db('paiements');
      
      if (date_debut) {
        query = query.where('date_paiement', '>=', date_debut);
      }
      
      if (date_fin) {
        query = query.where('date_paiement', '<=', date_fin);
      }
      
      const result = await query.sum('montant as total').first();
      return { total: parseFloat(result.total) || 0 };
    } catch (error) {
      console.error('Erreur PaiementRepository.getPaiementsByPeriode:', error);
      throw new Error('Erreur lors du calcul des paiements par période');
    }
  }

  query() {
    return db('paiements');
  }
}

export default PaiementRepository;