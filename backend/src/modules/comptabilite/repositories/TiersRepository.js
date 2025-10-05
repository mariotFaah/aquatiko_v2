import { db } from '../../../core/database/connection.js';

export class TiersRepository {
  
  // Récupérer tous les tiers
  async findAll() {
    try {
      const tiers = await db('tiers')
        .select('*')
        .orderBy('nom', 'asc');
      
      return tiers;
    } catch (error) {
      console.error('Erreur TiersRepository.findAll:', error);
      throw new Error('Erreur lors de la récupération des tiers');
    }
  }

  // Récupérer un tiers par ID
  async findById(id_tiers) {
    try {
      const tiers = await db('tiers')
        .where('id_tiers', id_tiers)
        .first();
      
      return tiers;
    } catch (error) {
      console.error('Erreur TiersRepository.findById:', error);
      throw new Error('Erreur lors de la récupération du tiers');
    }
  }

  // Créer un nouveau tiers
  async create(tiersData) {
    try {
      const [id] = await db('tiers').insert(tiersData);
      
      const nouveauTiers = await this.findById(id);
      return nouveauTiers;
    } catch (error) {
      console.error('Erreur TiersRepository.create:', error);
      throw new Error('Erreur lors de la création du tiers');
    }
  }

  // Mettre à jour un tiers
  async update(id_tiers, tiersData) {
    try {
      await db('tiers')
        .where('id_tiers', id_tiers)
        .update({
          ...tiersData,
          updated_at: new Date()
        });
      
      const tiersMaj = await this.findById(id_tiers);
      return tiersMaj;
    } catch (error) {
      console.error('Erreur TiersRepository.update:', error);
      throw new Error('Erreur lors de la mise à jour du tiers');
    }
  }

  // Supprimer un tiers (soft delete)
  async delete(id_tiers) {
    try {
      await db('tiers')
        .where('id_tiers', id_tiers)
        .update({
          actif: false,
          updated_at: new Date()
        });
      
      return { message: 'Tiers désactivé avec succès' };
    } catch (error) {
      console.error('Erreur TiersRepository.delete:', error);
      throw new Error('Erreur lors de la suppression du tiers');
    }
  }

  // Vérifier si un numéro existe déjà
  async numeroExists(numero, excludeId = null) {
    try {
      const query = db('tiers')
        .where('numero', numero);
      
      if (excludeId) {
        query.whereNot('id_tiers', excludeId);
      }
      
      const exists = await query.first();
      return !!exists;
    } catch (error) {
      console.error('Erreur TiersRepository.numeroExists:', error);
      throw new Error('Erreur lors de la vérification du numéro');
    }
  }
}

export default TiersRepository;