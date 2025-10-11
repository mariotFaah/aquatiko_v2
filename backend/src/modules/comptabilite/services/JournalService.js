// src/modules/comptabilite/services/JournalService.js
import { EcritureComptableRepository } from '../repositories/EcritureComptableRepository.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { PaiementRepository } from '../repositories/PaiementRepository.js';

export class JournalService {
  constructor() {
    this.ecritureRepo = new EcritureComptableRepository();
    this.factureRepo = new FactureRepository();
    this.paiementRepo = new PaiementRepository();
  }

  async genererEcritureFacture(facture) {
    const ecritures = [];
    const date = new Date();
    const prefix = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Écriture client (411000)
    ecritures.push({
      numero_ecriture: `${prefix}-${facture.numero_facture}-1`,
      date: facture.date,
      journal: facture.type_facture === 'avoir' ? 'achats' : 'ventes',
      compte: '411000', // Clients
      libelle: `Facture ${facture.numero_facture}`,
      debit: facture.type_facture === 'avoir' ? 0 : facture.total_ttc,
      credit: facture.type_facture === 'avoir' ? facture.total_ttc : 0,
      devise: facture.devise,
      taux_change: facture.taux_change,
      reference: facture.numero_facture
    });

    // Écriture TVA collectée (445710)
    if (facture.total_tva > 0) {
      ecritures.push({
        numero_ecriture: `${prefix}-${facture.numero_facture}-2`,
        date: facture.date,
        journal: facture.type_facture === 'avoir' ? 'achats' : 'ventes',
        compte: '445710', // TVA collectée
        libelle: `TVA Facture ${facture.numero_facture}`,
        debit: facture.type_facture === 'avoir' ? facture.total_tva : 0,
        credit: facture.type_facture === 'avoir' ? 0 : facture.total_tva,
        devise: facture.devise,
        taux_change: facture.taux_change,
        reference: facture.numero_facture
      });
    }

    // Écriture produit/vente (7xxxxx)
    ecritures.push({
      numero_ecriture: `${prefix}-${facture.numero_facture}-3`,
      date: facture.date,
      journal: facture.type_facture === 'avoir' ? 'achats' : 'ventes',
      compte: facture.type_facture === 'avoir' ? '607000' : '701000', // Achats ou Ventes
      libelle: `Facture ${facture.numero_facture}`,
      debit: facture.type_facture === 'avoir' ? 0 : facture.total_ht,
      credit: facture.type_facture === 'avoir' ? facture.total_ht : 0,
      devise: facture.devise,
      taux_change: facture.taux_change,
      reference: facture.numero_facture
    });

    for (const ecriture of ecritures) {
      await this.ecritureRepo.create(ecriture);
    }
  }

  async genererEcriturePaiement(paiement) {
    const date = new Date();
    const prefix = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;

    const ecriture = {
      numero_ecriture: `${prefix}-PAY-${paiement.id_paiement}`,
      date: paiement.date_paiement,
      journal: 'banque',
      compte: this.getCompteByModePaiement(paiement.mode_paiement),
      libelle: `Paiement ${paiement.reference || paiement.id_paiement}`,
      debit: paiement.montant,
      credit: 0,
      devise: paiement.devise,
      taux_change: paiement.taux_change,
      reference: `PAY-${paiement.id_paiement}`
    };

    return this.ecritureRepo.create(ecriture);
  }

  getCompteByModePaiement(mode_paiement) {
    const comptes = {
      'espèce': '530000', // Caisse
      'virement': '512000', // Banque
      'chèque': '511000', // Chèques
      'carte': '513000' // Cartes
    };
    return comptes[mode_paiement] || '512000';
  }
}