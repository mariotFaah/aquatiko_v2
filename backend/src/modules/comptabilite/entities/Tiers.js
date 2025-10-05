export class Tiers {
  constructor(data) {
    this.id_tiers = data.id_tiers;
    this.nom = data.nom;
    this.numero = data.numero;
    this.adresse = data.adresse;
    this.email = data.email;
    this.type_tiers = data.type_tiers; // 'client', 'fournisseur'
    this.telephone = data.telephone;
    this.created_at = data.created_at || new Date();
  }
}