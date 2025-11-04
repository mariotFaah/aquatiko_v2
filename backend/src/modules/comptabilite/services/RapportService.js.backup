// src/modules/comptabilite/services/RapportService.js
import { EcritureComptableRepository } from '../repositories/EcritureComptableRepository.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { PaiementRepository } from '../repositories/PaiementRepository.js';

export class RapportService {
  constructor() {
    this.ecritureRepo = new EcritureComptableRepository();
    this.factureRepo = new FactureRepository();
    this.paiementRepo = new PaiementRepository();
  }

  async genererBilan(date_fin) {
    const comptes = [
      '101000', '102000', '103000', // Capitaux
      '211000', '213000', '215000', // Immobilisations
      '311000', '312000', '313000', // Stocks
      '411000', '412000', // Clients
      '511000', '512000', '513000', // Banque
      '445710', '445620' // TVA
    ];

    const bilan = {};
    
    for (const compte of comptes) {
      bilan[compte] = await this.ecritureRepo.getSoldeCompte(compte, date_fin);
    }

    return bilan;
  }

  async genererCompteResultat(date_debut, date_fin) {
    const comptes_charges = ['601000', '602000', '607000', '611000', '612000', '613000'];
    const comptes_produits = ['701000', '702000', '703000', '704000', '705000'];

    const resultat = {
      charges: 0,
      produits: 0
    };

    for (const compte of comptes_charges) {
      const solde = await this.ecritureRepo.getSoldeCompte(compte, date_fin);
      resultat.charges += Math.abs(solde.solde);
    }

    for (const compte of comptes_produits) {
      const solde = await this.ecritureRepo.getSoldeCompte(compte, date_fin);
      resultat.produits += Math.abs(solde.solde);
    }

    resultat.resultat_net = resultat.produits - resultat.charges;

    return resultat;
  }

  async genererTresorerie(date_debut = '2024-01-01', date_fin = '2024-12-31') {
    try {
      // Utiliser les méthodes existantes des repositories
      const paiementsData = await this.paiementRepo.getPaiementsByPeriode(date_debut, date_fin);
      const facturesData = await this.factureRepo.getFacturesByPeriode(date_debut, date_fin);
      
      const entrees = parseFloat(paiementsData.total) || 0;
      const sorties_prevues = parseFloat(facturesData.total) || 0;

      return {
        entrees: entrees,
        sorties_prevues: sorties_prevues,
        solde_tresorerie: entrees - sorties_prevues,
        periode: `${date_debut} à ${date_fin}`,
        details: {
          total_paiements: entrees,
          total_factures: sorties_prevues
        }
      };
    } catch (error) {
      console.error('Erreur RapportService.genererTresorerie:', error);
      // Solution de repli avec calcul manuel
      const paiements = await this.paiementRepo.findByPeriode(date_debut, date_fin);
      const factures = await this.factureRepo.findAll();
      
      const entrees = paiements.reduce((sum, p) => sum + parseFloat(p.montant), 0);
      const facturesPeriode = factures.filter(f => 
        f.date >= date_debut && f.date <= date_fin
      );
      const sorties_prevues = facturesPeriode.reduce((sum, f) => sum + parseFloat(f.total_ttc), 0);

      return {
        entrees: entrees,
        sorties_prevues: sorties_prevues,
        solde_tresorerie: entrees - sorties_prevues,
        periode: `${date_debut} à ${date_fin}`,
        note: "Calculé à partir des données disponibles"
      };
    }
  }

  async genererRapportTVA(date_debut = '2024-01-01', date_fin = '2024-12-31') {
    try {
      // Inclure les deux comptes TVA
      const tva_ecritures = await this.ecritureRepo.query()
        .whereIn('compte', ['445710', '445620']) // TVA collectée ET déductible
        .whereBetween('date', [date_debut, date_fin])
        .select('*');

      // Séparer les deux types de TVA
      const tva_collectee = tva_ecritures
        .filter(e => e.compte === '445710')
        .reduce((sum, e) => sum + parseFloat(e.credit), 0);
        
      const tva_deductable = tva_ecritures
        .filter(e => e.compte === '445620') 
        .reduce((sum, e) => sum + parseFloat(e.debit), 0);

      return {
        tva_collectee: tva_collectee,
        tva_deductable: tva_deductable,
        tva_a_payer: tva_collectee - tva_deductable,
        periode: `${date_debut} à ${date_fin}`,
        nombre_ecritures: tva_ecritures.length
      };
    } catch (error) {
      console.error('Erreur RapportService.genererRapportTVA:', error);
      // Solution de repli avec les deux comptes
      try {
        const tva_collectee_data = await this.ecritureRepo.getSoldeCompte('445710', date_fin);
        const tva_deductable_data = await this.ecritureRepo.getSoldeCompte('445620', date_fin);
        
        return {
          tva_collectee: tva_collectee_data.credit,
          tva_deductable: tva_deductable_data.debit,
          tva_a_payer: tva_collectee_data.credit - tva_deductable_data.debit,
          periode: `${date_debut} à ${date_fin}`,
          note: "Calculé à partir des soldes des comptes TVA"
        };
      } catch (fallbackError) {
        console.error('Erreur solution de repli TVA:', fallbackError);
        throw new Error('Impossible de générer le rapport TVA');
      }
    }
  }
}