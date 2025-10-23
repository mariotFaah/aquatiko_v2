class Expedition {
  constructor(data = {}) {
    this.id = data.id;
    this.commande_id = data.commande_id;
    this.numero_bl = data.numero_bl;
    this.numero_connaissement = data.numero_connaissement;
    this.numero_packing_list = data.numero_packing_list;
    this.date_expedition = data.date_expedition;
    this.date_arrivee_prevue = data.date_arrivee_prevue;
    this.date_arrivee_reelle = data.date_arrivee_reelle;
    this.transporteur = data.transporteur;
    this.mode_transport = data.mode_transport;
    this.instructions_speciales = data.instructions_speciales;
    this.statut = data.statut || 'preparation';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

export default Expedition;
