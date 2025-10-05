export class Article {
  constructor(data) {
    this.code_article = data.code_article;
    this.description = data.description;
    this.prix_unitaire = data.prix_unitaire;
    this.taux_tva = data.taux_tva || 20; // 20% par défaut
    this.unite = data.unite || 'unite';
    this.actif = data.actif !== undefined ? data.actif : true;
  }
}
