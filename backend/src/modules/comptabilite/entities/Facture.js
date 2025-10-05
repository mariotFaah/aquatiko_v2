export class Facture {
  constructor(data) {
    this.numero_facture = data.numero_facture;
    this.date = data.date || new Date();
    this.type_facture = data.type_facture; // 'proforma', 'facture', 'avoir'
    this.id_tiers = data.id_tiers;
    this.echeance = data.echeance;
    this.reglement = data.reglement;
    this.total_ht = data.total_ht || 0;
    this.total_tva = data.total_tva || 0;
    this.total_ttc = data.total_ttc || 0;
    this.statut = data.statut || 'brouillon';
  }
}