import { db } from '../../../core/database/connection.js';

export class PaiementRepository {
  
  // Récupérer tous les paiements d'une facture
  async findByFacture(numero_facture) {
    try {
      const paiements = await db('paiements as p')
        .join('factures as f', 'p.numero_facture', 'f.numero_facture')
        .select(
          'p.*',
          'f.total_ttc',
          'f.devise as devise_facture'
        )
        .where('p.numero_facture', numero_facture)
        .orderBy('p.date_paiement', 'desc');
      
      return paiements;
    } catch (error) {
      console.error('Erreur PaiementRepository.findByFacture:', error);
      throw new Error('Erreur lors de la récupération des paiements');
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
        .andWhere('statut', 'validé')
        .sum('montant as total')
        .first();
      
      return result.total || 0;
    } catch (error) {
      console.error('Erreur PaiementRepository.getTotalPaiementsFacture:', error);
      throw new Error('Erreur lors du calcul du total des paiements');
    }
  }

  // Mettre à jour le statut d'un paiement
  async updateStatut(id_paiement, statut) {
    try {
      await db('paiements')
        .where('id_paiement', id_paiement)
        .update({
          statut: statut,
          updated_at: new Date()
        });
      
      return { message: `Statut du paiement mis à jour: ${statut}` };
    } catch (error) {
      console.error('Erreur PaiementRepository.updateStatut:', error);
      throw new Error('Erreur lors de la mise à jour du statut du paiement');
    }
  }

   query() {
    return db('paiements');
  }

  async findByFacture(numero_facture) {
    try {
      const paiements = await db('paiements as p')
        .join('factures as f', 'p.numero_facture', 'f.numero_facture')
        .select(
          'p.*',
          'f.total_ttc',
          'f.devise as devise_facture'
        )
        .where('p.numero_facture', numero_facture)
        .orderBy('p.date_paiement', 'desc');
      
      return paiements;
    } catch (error) {
      console.error('Erreur PaiementRepository.findByFacture:', error);
      throw new Error('Erreur lors de la récupération des paiements');
    }
  }

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

// AJOUTER CETTE MÉTHODE
  query() {
    return db('paiements');
  }

  // AJOUTER CETTE MÉTHODE POUR RAPPORT SERVICE
  async getPaiementsByPeriode(date_debut, date_fin) {
    try {
      let query = db('paiements')
        .where('statut', 'validé');
      
      if (date_debut) {
        query = query.andWhere('date_paiement', '>=', date_debut);
      }
      
      if (date_fin) {
        query = query.andWhere('date_paiement', '<=', date_fin);
      }
      
      const result = await query.sum('montant as total');
      return result[0];
    } catch (error) {
      console.error('Erreur PaiementRepository.getPaiementsByPeriode:', error);
      throw new Error('Erreur lors du calcul des paiements par période');
    }
  }
  // Récupérer tous les paiements par période
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

  // Dans PaiementRepository.js
async getPaiements() {
  try {
    return await db('paiements')
      .join('factures', 'paiements.numero_facture', 'factures.numero_facture')
      .select('paiements.*', 'factures.nom_tiers');
  } catch (error) {
    console.error('Erreur PaiementRepository.getPaiements:', error);
    throw new Error('Erreur lors de la récupération des paiements');
  }
}
}

export default PaiementRepository;