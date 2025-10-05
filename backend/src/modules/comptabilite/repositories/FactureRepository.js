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
  async findById(numero_facture) {
    try {
      const facture = await db('factures as f')
        .join('tiers as t', 'f.id_tiers', 't.id_tiers')
        .select(
          'f.*',
          't.nom as nom_tiers',
          't.adresse',
          't.email',
          't.telephone'
        )
        .where('f.numero_facture', numero_facture)
        .first();
      
      return facture;
    } catch (error) {
      console.error('Erreur FactureRepository.findById:', error);
      throw new Error('Erreur lors de la récupération de la facture');
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
  async update(numero_facture, factureData) {
    try {
      await db('factures')
        .where('numero_facture', numero_facture)
        .update({
          ...factureData,
          updated_at: new Date()
        });
      
      const factureMaj = await this.findById(numero_facture);
      return factureMaj;
    } catch (error) {
      console.error('Erreur FactureRepository.update:', error);
      throw new Error('Erreur lors de la mise à jour de la facture');
    }
  }

  // Valider une facture
  async valider(numero_facture) {
    try {
      await db('factures')
        .where('numero_facture', numero_facture)
        .update({
          statut: 'validee',
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
}

export default FactureRepository;