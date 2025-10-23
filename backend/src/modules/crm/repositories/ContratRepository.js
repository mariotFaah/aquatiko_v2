import { db } from '../../../core/database/connection.js';

export class ContratRepository {
  async findByClient(tiers_id) {
    try {
      const contrats = await db('contrats')
        .where('tiers_id', tiers_id)
        .orderBy('date_debut', 'desc');
      
      return contrats;
    } catch (error) {
      console.error('Erreur ContratRepository.findByClient:', error);
      throw new Error('Erreur lors de la récupération des contrats');
    }
  }
}

export default ContratRepository;
