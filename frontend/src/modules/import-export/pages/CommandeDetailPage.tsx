import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { importExportApi } from '../services/api';
import type { Commande, CalculMarge, ExpeditionFormData } from '../types';
import './CommandeDetailPage.css';

const CommandeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [marge, setMarge] = useState<CalculMarge | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles');
  const [showExpeditionForm, setShowExpeditionForm] = useState(false);
  const [savingExpedition, setSavingExpedition] = useState(false);

  const [expeditionForm, setExpeditionForm] = useState<ExpeditionFormData>({
    commande_id: parseInt(id!),
    numero_bl: '',
    numero_connaissement: '',
    numero_packing_list: '',
    date_expedition: '',
    date_arrivee_prevue: '',
    transporteur: '',
    mode_transport: '',
    instructions_speciales: '',
    statut: 'preparation'
  });

  useEffect(() => {
    if (id) {
      loadCommande();
    }
  }, [id]);

  const loadCommande = async () => {
    try {
      setLoading(true);
      const commandeData = await importExportApi.getCommande(parseInt(id!));
      setCommande(commandeData);

      // Pré-remplir le formulaire d'expédition si une expédition existe
      if (commandeData.expedition) {
        setExpeditionForm(prev => ({
          ...prev,
          numero_bl: commandeData.expedition!.numero_bl || '',
          numero_connaissement: commandeData.expedition!.numero_connaissement || '',
          numero_packing_list: commandeData.expedition!.numero_packing_list || '',
          date_expedition: commandeData.expedition!.date_expedition ? commandeData.expedition!.date_expedition.split('T')[0] : '',
          date_arrivee_prevue: commandeData.expedition!.date_arrivee_prevue ? commandeData.expedition!.date_arrivee_prevue.split('T')[0] : '',
          transporteur: commandeData.expedition!.transporteur || '',
          mode_transport: commandeData.expedition!.mode_transport || '',
          instructions_speciales: commandeData.expedition!.instructions_speciales || '',
          statut: commandeData.expedition!.statut || 'preparation'
        }));
      }

      try {
        const margeData = await importExportApi.calculerMarge(parseInt(id!));
        setMarge(margeData);
      } catch (error) {
        console.log('Calcul de marge non disponible');
      }
    } catch (error) {
      console.error('Erreur chargement commande:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpeditionInputChange = (field: keyof ExpeditionFormData, value: any) => {
    setExpeditionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveExpedition = async () => {
    try {
      setSavingExpedition(true);
      await importExportApi.updateExpedition(expeditionForm);
      alert('Expédition enregistrée avec succès!');
      setShowExpeditionForm(false);
      // Recharger les données de la commande
      await loadCommande();
    } catch (error) {
      console.error('Erreur sauvegarde expédition:', error);
      alert("Erreur lors de la sauvegarde de lc'expédition");
    } finally {
      setSavingExpedition(false);
    }
  };

  const getStatutColor = (statut: string) => {
    const colors = {
      brouillon: 'statut-brouillon',
      confirmée: 'statut-confirmée',
      expédiée: 'statut-expédiée',
      livrée: 'statut-livrée',
      annulée: 'statut-annulée'
    };
    return colors[statut as keyof typeof colors] || 'statut-brouillon';
  };

 const getTypeText = (type: string) => {
  return type === "import" ? "Commande d'Import" : "Commande d'Export";
};


  const calculerTotauxLignes = () => {
    if (!commande?.lignes) return { totalHT: 0, totalTVA: 0, totalTTC: 0 };
    
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    commande.lignes.forEach(ligne => {
      const montantHT = ligne.quantite * parseFloat(ligne.prix_unitaire.toString());
      const montantTVA = montantHT * (ligne.taux_tva / 100);
      const montantTTC = montantHT + montantTVA;

      totalHT += montantHT;
      totalTVA += montantTVA;
      totalTTC += montantTTC;
    });

    return { totalHT, totalTVA, totalTTC };
  };

  const { totalHT, totalTVA, totalTTC } = calculerTotauxLignes();

  if (loading) {
    return (
      <div className="commande-detail-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          Chargement du bon de commande...
        </div>
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="commande-detail-container">
        <div className="empty-state">
          <h3>Bon de commande non trouvé</h3>
          <p>Le bon de commande que vous recherchez n'existe pas.</p>
          <Link to="/import-export/commandes" className="btn-secondary">
            Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="commande-detail-container">
      <div className="commande-detail-content">
        {/* Header avec actions */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">Bon de Commande</h1>
            <div className="header-subtitle">
              <span className="commande-reference">{commande.numero_commande}</span>
              <span className="statut-separator">•</span>
              <span className={`statut-badge ${getStatutColor(commande.statut)}`}>
                {commande.statut}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              📄 Imprimer
            </button>
            <button className="btn btn-secondary">
              📧 Envoyer
            </button>
            
            {/* BOUTON GÉRER L'EXPÉDITION */}
            <button 
              onClick={() => setShowExpeditionForm(!showExpeditionForm)}
              className="btn btn-primary"
            >
              🚚 {commande.expedition ? "Modifier l'expédition" : "Créer une expédition"}
            </button>

            
            <Link 
              to={`/import-export/commandes/${commande.id}/edit`}
              className="btn btn-primary"
            >
              ✏️ Modifier
            </Link>
            <Link 
              to={`/import-export/commandes/${commande.id}/marge`}
              className="btn btn-primary"
            >
              📊 Analyser la rentabilité
            </Link>
            <Link 
              to="/import-export/commandes"
              className="btn btn-outline"
            >
              ← Retour
            </Link>
          </div>
        </div>

        {/* FORMULAIRE D'EXPÉDITION INTÉGRÉ */}
        {showExpeditionForm && (
          <div className="expedition-form-section">
            <div className="section-card">
              <div className="section-header">
                <h3>
                  {commande.expedition ? "Modifier l'Expédition" : "Créer une Expédition"}
                </h3>
                <button 
                  onClick={() => setShowExpeditionForm(false)}
                  className="btn btn-outline"
                >
                  ✕ Fermer
                </button>
              </div>

              <div className="expedition-form-grid">
                <div className="form-group">
                  <label>Statut de l'expédition</label>
                  <select
                    value={expeditionForm.statut}
                    onChange={(e) => handleExpeditionInputChange('statut', e.target.value)}
                    className="form-input"
                  >
                    <option value="preparation">En préparation</option>
                    <option value="expédiée">Expédiée</option>
                    <option value="transit">En transit</option>
                    <option value="arrivée">Arrivée</option>
                    <option value="livrée">Livrée</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Transporteur</label>
                  <input
                    type="text"
                    value={expeditionForm.transporteur}
                    onChange={(e) => handleExpeditionInputChange('transporteur', e.target.value)}
                    className="form-input"
                    placeholder="Nom du transporteur"
                  />
                </div>

                <div className="form-group">
                  <label>Mode de transport</label>
                  <select
                    value={expeditionForm.mode_transport}
                    onChange={(e) => handleExpeditionInputChange('mode_transport', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Sélectionnez un mode</option>
                    <option value="maritime">Maritime</option>
                    <option value="aerien">Aérien</option>
                    <option value="terrestre">Terrestre</option>
                    <option value="multimodal">Multimodal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date d'expédition</label>
                  <input
                    type="date"
                    value={expeditionForm.date_expedition}
                    onChange={(e) => handleExpeditionInputChange('date_expedition', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Date d'arrivée prévue</label>
                  <input
                    type="date"
                    value={expeditionForm.date_arrivee_prevue}
                    onChange={(e) => handleExpeditionInputChange('date_arrivee_prevue', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Numéro de Bon de Livraison</label>
                  <input
                    type="text"
                    value={expeditionForm.numero_bl}
                    onChange={(e) => handleExpeditionInputChange('numero_bl', e.target.value)}
                    className="form-input"
                    placeholder="BL-XXXXXX"
                  />
                </div>

                <div className="form-group">
                  <label>Numéro de Connaissement</label>
                  <input
                    type="text"
                    value={expeditionForm.numero_connaissement}
                    onChange={(e) => handleExpeditionInputChange('numero_connaissement', e.target.value)}
                    className="form-input"
                    placeholder="CON-XXXXXX"
                  />
                </div>

                <div className="form-group">
                  <label>Numéro de Packing List</label>
                  <input
                    type="text"
                    value={expeditionForm.numero_packing_list}
                    onChange={(e) => handleExpeditionInputChange('numero_packing_list', e.target.value)}
                    className="form-input"
                    placeholder="PL-XXXXXX"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Instructions spéciales</label>
                  <textarea
                    value={expeditionForm.instructions_speciales}
                    onChange={(e) => handleExpeditionInputChange('instructions_speciales', e.target.value)}
                    className="form-textarea"
                    placeholder="Instructions particulières pour l'expédition..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  onClick={handleSaveExpedition}
                  disabled={savingExpedition}
                  className="btn btn-primary"
                >
                {savingExpedition ? "💾 Enregistrement..." : "💾 Enregistrer l'expédition"}

                </button>
                <button 
                  onClick={() => setShowExpeditionForm(false)}
                  className="btn btn-outline"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Informations principales */}
        <div className="commande-header-card">
          <div className="commande-type-badge">
            {getTypeText(commande.type)}
          </div>
          
          <div className="commande-infos-grid">
            <div className="info-block">
              <label>Date de commande</label>
              <div className="info-value">
                {new Date(commande.date_commande).toLocaleDateString('fr-FR')}
              </div>
            </div>
            
            <div className="info-block">
              <label>Client</label>
              <div className="info-value">
                <strong>{commande.client?.nom}</strong>
                {commande.client?.email && (
                  <div className="info-subtext">{commande.client.email}</div>
                )}
                {commande.client?.telephone && (
                  <div className="info-subtext">{commande.client.telephone}</div>
                )}
              </div>
            </div>
            
            <div className="info-block">
              <label>Fournisseur</label>
              <div className="info-value">
                <strong>{commande.fournisseur?.nom}</strong>
                {commande.fournisseur?.email && (
                  <div className="info-subtext">{commande.fournisseur.email}</div>
                )}
                {commande.fournisseur?.telephone && (
                  <div className="info-subtext">{commande.fournisseur.telephone}</div>
                )}
              </div>
            </div>
            
            <div className="info-block">
              <label>Devise</label>
              <div className="info-value">
                <strong>{commande.devise}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="tabs-navigation">
          <button 
            className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
            onClick={() => setActiveTab('articles')}
          >
            📦 Articles et Services
          </button>
          <button 
            className={`tab-btn ${activeTab === 'livraison' ? 'active' : ''}`}
            onClick={() => setActiveTab('livraison')}
          >
            🚚 Livraison
          </button>
          <button 
            className={`tab-btn ${activeTab === 'financier' ? 'active' : ''}`}
            onClick={() => setActiveTab('financier')}
          >
            💰 Informations Financières
          </button>
          <button 
            className={`tab-btn ${activeTab === 'autres' ? 'active' : ''}`}
            onClick={() => setActiveTab('autres')}
          >
            📋 Autres Informations
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="tab-content">
          {/* Onglet Articles et Services */}
          {activeTab === 'articles' && (
            <div className="tab-panel">
              {/* ... (le reste du code pour l'onglet articles reste identique) */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Articles Commandés</h3>
                  <div className="section-actions">
                    <span className="badge">{commande.lignes?.length || 0} articles</span>
                  </div>
                </div>

                {commande.lignes && commande.lignes.length > 0 ? (
                  <div className="table-container">
                    <table className="order-lines-table">
                      <thead>
                        <tr>
                          <th className="col-article">Article</th>
                          <th className="col-description">Description</th>
                          <th className="col-quantity">Quantité</th>
                          <th className="col-price">Prix Unitaire</th>
                          <th className="col-tax">TVA</th>
                          <th className="col-total">Montant HT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commande.lignes.map((ligne, index) => {
                          const montantHT = ligne.quantite * parseFloat(ligne.prix_unitaire.toString());
                          
                          return (
                            <tr key={ligne.id || index} className="order-line">
                              <td className="col-article">
                                <div className="article-info">
                                  <div className="article-code">{ligne.article_id}</div>
                                  {ligne.article && (
                                    <div className="article-ref">
                                      {ligne.article.description}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="col-description">
                                {ligne.description}
                              </td>
                              <td className="col-quantity">
                                <div className="quantity-display">
                                  {ligne.quantite}
                                </div>
                              </td>
                              <td className="col-price">
                                {new Intl.NumberFormat('fr-FR', { 
                                  style: 'currency', 
                                  currency: commande.devise 
                                }).format(parseFloat(ligne.prix_unitaire.toString()))}
                              </td>
                              <td className="col-tax">
                                <div className="tax-badge">
                                  {ligne.taux_tva}%
                                </div>
                              </td>
                              <td className="col-total">
                                <strong>
                                  {new Intl.NumberFormat('fr-FR', { 
                                    style: 'currency', 
                                    currency: commande.devise 
                                  }).format(montantHT)}
                                </strong>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Aucun article dans ce bon de commande</p>
                  </div>
                )}

                {/* Totaux */}
                <div className="order-totals">
                  <div className="total-line">
                    <span className="total-label">Sous-total HT:</span>
                    <span className="total-value">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: commande.devise 
                      }).format(totalHT)}
                    </span>
                  </div>
                  
                  <div className="total-line">
                    <span className="total-label">TVA:</span>
                    <span className="total-value">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: commande.devise 
                      }).format(totalTVA)}
                    </span>
                  </div>
                  
                  <div className="total-line total-final">
                    <span className="total-label">Total TTC:</span>
                    <span className="total-value">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: commande.devise 
                      }).format(totalTTC)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Analyse de marge */}
              {marge && (
                <div className="section-card">
                  <div className="section-header">
                    <h3>Analyse de Rentabilité</h3>
                  </div>
                  <div className="profitability-grid">
                    <div className="profit-item">
                      <div className="profit-label">Chiffre d'affaires</div>
                      <div className="profit-value revenue">
                        {new Intl.NumberFormat('fr-FR', { 
                          style: 'currency', 
                          currency: commande.devise 
                        }).format(marge.chiffre_affaires)}
                      </div>
                    </div>
                    
                    <div className="profit-item">
                      <div className="profit-label">Coûts logistiques</div>
                      <div className="profit-value cost">
                        {new Intl.NumberFormat('fr-FR', { 
                          style: 'currency', 
                          currency: commande.devise 
                        }).format(marge.total_couts)}
                      </div>
                    </div>
                    
                    <div className="profit-item">
                      <div className="profit-label">Marge brute</div>
                      <div className="profit-value margin">
                        {new Intl.NumberFormat('fr-FR', { 
                          style: 'currency', 
                          currency: commande.devise 
                        }).format(marge.marge_brute)}
                      </div>
                    </div>
                    
                    <div className="profit-item">
                      <div className="profit-label">Taux de marge</div>
                      <div className={`profit-value rate ${marge.taux_marge >= 20 ? 'high' : marge.taux_marge >= 10 ? 'medium' : 'low'}`}>
                        {marge.taux_marge.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Onglet Livraison */}
          {activeTab === 'livraison' && (
            <div className="tab-panel">
              <div className="section-card">
                <div className="section-header">
                  <h3>Informations de Livraison</h3>
                  <div className="section-actions">
                    <button 
                      onClick={() => setShowExpeditionForm(!showExpeditionForm)}
                      className="btn btn-primary"
                    >
                      🚚 {commande.expedition ? "Modifier l'expédition" : "Créer une expédition"}

                    </button>
                  </div>
                </div>
                
                {commande.expedition ? (
                  <div className="delivery-grid">
                    <div className="delivery-section">
                      <h4>Adresse de Livraison</h4>
                      <div className="address-card">
                        <div className="address-name">{commande.client?.nom}</div>
                        <div className="address-details">{commande.client?.adresse}</div>
                      </div>
                    </div>
                    
                    <div className="delivery-section">
                      <h4>Informations d'Expédition</h4>
                      <div className="shipping-info">
                        <div className="info-row">
                          <span className="info-label">Transporteur:</span>
                          <span className="info-value">{commande.expedition.transporteur || 'Non spécifié'}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Mode de transport:</span>
                          <span className="info-value">{commande.expedition.mode_transport || 'Non spécifié'}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Statut:</span>
                          <span className={`info-value ${getStatutColor(commande.expedition.statut)}`}>
                            {commande.expedition.statut}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="delivery-section">
                      <h4>Documents</h4>
                      <div className="documents-list">
                        {commande.expedition.numero_bl && (
                          <div className="document-item">
                            <span className="doc-icon">📄</span>
                            <span className="doc-name">Bon de Livraison:</span>
                            <span className="doc-number">{commande.expedition.numero_bl}</span>
                          </div>
                        )}
                        {commande.expedition.numero_connaissement && (
                          <div className="document-item">
                            <span className="doc-icon">🧾</span>
                            <span className="doc-name">Connaissement:</span>
                            <span className="doc-number">{commande.expedition.numero_connaissement}</span>
                          </div>
                        )}
                        {commande.expedition.numero_packing_list && (
                          <div className="document-item">
                            <span className="doc-icon">📦</span>
                            <span className="doc-name">Packing List:</span>
                            <span className="doc-number">{commande.expedition.numero_packing_list}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🚚</div>
                    <h4>Aucune information d'expédition disponible</h4>
                    <p>Créez une expédition pour suivre la logistique de cette commande.</p>
                    <button 
                      onClick={() => setShowExpeditionForm(true)}
                      className="btn btn-primary"
                    >
                      🚚 Créer une expédition
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Les autres onglets restent inchangés */}
          {activeTab === 'financier' && (
            <div className="tab-panel">
              {/* ... contenu financier existant ... */}
            </div>
          )}

          {activeTab === 'autres' && (
            <div className="tab-panel">
              {/* ... contenu autres informations existant ... */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandeDetailPage;
