import { db } from '../../../core/database/connection.js';

export class ActiviteRepository {
  async findByClient(tiers_id) {
    try {
      const activites = await db('activites')
        .where('tiers_id', tiers_id)
        .orderBy('date_activite', 'desc');
      
      return activites;
    } catch (error) {
      console.error('Erreur ActiviteRepository.findByClient:', error);
      throw new Error('Erreur lors de la récupération des activités');
    }
  }
}

export default ActiviteRepository;
