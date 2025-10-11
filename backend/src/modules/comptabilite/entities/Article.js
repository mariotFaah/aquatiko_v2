// src/modules/comptabilite/entities/Article.js (mis à jour)
export class Article {
  constructor(data) {
    this.code_article = data.code_article;
    this.description = data.description;
    this.prix_unitaire = data.prix_unitaire;
    this.taux_tva = data.taux_tva || 20;
    this.unite = data.unite || 'unite';
    this.devise = data.devise || 'MGA';
    this.actif = data.actif !== undefined ? data.actif : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}