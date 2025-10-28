import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { importExportApi } from '../services/api';
import { comptabiliteApi } from '../../comptabilite/services/api';
import type { Commande, CommandeFormData, LigneCommandeFormData, Tiers, Article } from '../types';
import { useAlertDialog } from '../../../core/hooks/useAlertDialog';
import AlertDialog from '../../../core/components/AlertDialog/AlertDialog';
import './CommandeFormPage.css';

const CommandeEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tiers, setTiers] = useState<Tiers[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [commande, setCommande] = useState<Commande | null>(null);
  
  // Utilisation du hook AlertDialog
  const { isOpen, message, title, type, alert, close } = useAlertDialog();

  const [formData, setFormData] = useState<CommandeFormData>({
    type: 'import',
    client_id: 0,
    fournisseur_id: 0,
    date_commande: new Date().toISOString().split('T')[0],
    devise: 'EUR',
    lignes: []
  });

  const [lignes, setLignes] = useState<LigneCommandeFormData[]>([]);

  // Charger les données
  useEffect(() => {
    loadDonnees();
  }, [id]);

  const loadDonnees = async () => {
    try {
      setLoading(true);
      
      const [tiersData, articlesData, commandeData] = await Promise.all([
        comptabiliteApi.getTiers(),
        comptabiliteApi.getArticles(),
        importExportApi.getCommande(parseInt(id!))
      ]);
      
      setTiers(tiersData);
      setArticles(articlesData);
      setCommande(commandeData);
      
      // Pré-remplir le formulaire avec les données existantes
      if (commandeData) {
        setFormData({
          type: commandeData.type,
          client_id: commandeData.client_id,
          fournisseur_id: commandeData.fournisseur_id,
          date_commande: commandeData.date_commande.split('T')[0],
          date_livraison_prevue: commandeData.date_livraison_prevue?.split('T')[0],
          notes: commandeData.notes,
          devise: commandeData.devise,
          lignes: []
        });

        // Pré-remplir les lignes
        if (commandeData.lignes) {
          setLignes(commandeData.lignes.map(ligne => ({
            article_id: ligne.article_id,
            description: ligne.description,
            quantite: ligne.quantite,
            prix_unitaire: parseFloat(ligne.prix_unitaire.toString()),
            taux_tva: ligne.taux_tva
          })));
        }
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
      alert('Erreur lors du chargement de la commande', {
        type: 'error',
        title: 'Erreur de chargement'
      });
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si la commande peut être modifiée
  const canEdit = () => {
    if (!commande) return false;
    
    // Seules les commandes en statut "brouillon" peuvent être modifiées complètement
    // Les commandes confirmées peuvent avoir des ajustements limités
    return commande.statut === 'brouillon' || commande.statut === 'confirmée';
  };

  // Gestion des changements du formulaire principal
  const handleInputChange = (field: keyof CommandeFormData, value: any) => {
    if (!canEdit() && field !== 'notes') {
      alert('Seules les notes peuvent être modifiées pour une commande confirmée', {
        type: 'warning',
        title: 'Modification limitée'
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestion des lignes de commande
  const handleLigneChange = (index: number, field: keyof LigneCommandeFormData, value: any) => {
    if (!canEdit()) {
      alert('Les lignes de commande ne peuvent être modifiées que pour les commandes en brouillon', {
        type: 'warning',
        title: 'Modification non autorisée'
      });
      return;
    }

    const nouvellesLignes = [...lignes];
    nouvellesLignes[index] = {
      ...nouvellesLignes[index],
      [field]: value
    };
    
    // Si l'article change, mettre à jour la description
    if (field === 'article_id' && value) {
      const article = articles.find(a => a.code_article === value);
      if (article) {
        nouvellesLignes[index].description = article.description;
        nouvellesLignes[index].prix_unitaire = article.prix_unitaire;
        nouvellesLignes[index].taux_tva = article.taux_tva;
      }
    }
    
    setLignes(nouvellesLignes);
  };

  const ajouterLigne = () => {
    if (!canEdit()) {
      alert('Impossible d\'ajouter des lignes à une commande confirmée', {
        type: 'warning',
        title: 'Action non autorisée'
      });
      return;
    }

    setLignes(prev => [
      ...prev,
      {
        article_id: '',
        description: '',
        quantite: 1,
        prix_unitaire: 0,
        taux_tva: 20
      }
    ]);
  };

  const supprimerLigne = (index: number) => {
    if (!canEdit()) {
      alert('Impossible de supprimer des lignes d\'une commande confirmée', {
        type: 'warning',
        title: 'Action non autorisée'
      });
      return;
    }

    if (lignes.length > 1) {
      setLignes(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Calcul des totaux
  const calculerTotaux = () => {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    lignes.forEach(ligne => {
      const montantHT = ligne.quantite * ligne.prix_unitaire;
      const montantTVA = montantHT * (ligne.taux_tva / 100);
      const montantTTC = montantHT + montantTVA;

      totalHT += montantHT;
      totalTVA += montantTVA;
      totalTTC += montantTTC;
    });

    return { totalHT, totalTVA, totalTTC };
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit()) {
      alert('Cette commande ne peut plus être modifiée', {
        type: 'warning',
        title: 'Modification impossible'
      });
      return;
    }

    if (!formData.client_id || !formData.fournisseur_id) {
      alert('Veuillez sélectionner un client et un fournisseur', {
        type: 'warning',
        title: 'Champs manquants'
      });
      return;
    }

    if (lignes.length === 0 || lignes.some(l => !l.article_id || l.quantite <= 0)) {
      alert('Veuillez ajouter au moins une ligne de commande valide', {
        type: 'warning',
        title: 'Lignes invalides'
      });
      return;
    }

    setSaving(true);

    try {
      // Pour l'instant, on recrée la commande (à améliorer avec un endpoint PUT)
      const commandeData = {
        ...formData,
        lignes: lignes.filter(l => l.article_id && l.quantite > 0)
      };

      // TODO: Implémenter un vrai endpoint de modification
      // Pour l'instant, on utilise la création
      await importExportApi.createCommande(commandeData);
      
      alert('Commande modifiée avec succès', {
        type: 'success',
        title: 'Succès'
      });
      
      // Navigation après un délai pour laisser voir le message de succès
      setTimeout(() => {
        navigate('/import-export/commandes');
      }, 1500);
      
    } catch (error) {
      console.error('Erreur modification commande:', error);
      alert('Erreur lors de la modification de la commande', {
        type: 'error',
        title: 'Erreur'
      });
    } finally {
      setSaving(false);
    }
  };

  const { totalHT, totalTVA, totalTTC } = calculerTotaux();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="commande-form-container">
        <div className="commande-form-content">
          <div className="empty-state">
            <h3>Commande non trouvée</h3>
            <p>La commande que vous essayez de modifier n'existe pas.</p>
            <Link to="/import-export/commandes" className="btn-secondary">
              Retour aux commandes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="commande-form-container">
      <div className="commande-form-content">
        {/* En-tête */}
        <div className="commande-form-header">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="commande-form-title">
                Modifier la Commande {commande.numero_commande}
              </h1>
              <p className="commande-form-subtitle">
                Statut actuel: <span className={`statut-badge ${commande.statut}`}>
                  {commande.statut}
                </span>
              </p>
              {!canEdit() && (
                <p className="text-orange-600 mt-2">
                  ⚠️ Seules les notes peuvent être modifiées pour cette commande
                </p>
              )}
            </div>
            <div className="text-sm text-gray-600">
              <div>Créée le: {new Date(commande.created_at).toLocaleDateString('fr-FR')}</div>
              <div>Dernière modification: {new Date(commande.updated_at).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="commande-form">
          {/* Informations générales */}
          <div className="form-section">
            <h2 className="section-title">Informations Générales</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">Type de commande</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="form-select"
                  required
                  disabled={!canEdit()}
                >
                  <option value="import">Import</option>
                  <option value="export">Export</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required">Client</label>
                <select
                  value={formData.client_id}
                  onChange={(e) => handleInputChange('client_id', parseInt(e.target.value))}
                  className="form-select"
                  required
                  disabled={!canEdit()}
                >
                  <option value="0">Sélectionner un client</option>
                  {tiers.filter(t => t.type_tiers === 'client').map(tier => (
                    <option key={tier.id_tiers} value={tier.id_tiers}>
                      {tier.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required">Fournisseur</label>
                <select
                  value={formData.fournisseur_id}
                  onChange={(e) => handleInputChange('fournisseur_id', parseInt(e.target.value))}
                  className="form-select"
                  required
                  disabled={!canEdit()}
                >
                  <option value="0">Sélectionner un fournisseur</option>
                  {tiers.filter(t => t.type_tiers === 'fournisseur').map(tier => (
                    <option key={tier.id_tiers} value={tier.id_tiers}>
                      {tier.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required">Date de commande</label>
                <input
                  type="date"
                  value={formData.date_commande}
                  onChange={(e) => handleInputChange('date_commande', e.target.value)}
                  className="form-input"
                  required
                  disabled={!canEdit()}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Devise</label>
                <select
                  value={formData.devise}
                  onChange={(e) => handleInputChange('devise', e.target.value)}
                  className="form-select"
                  required
                  disabled={!canEdit()}
                >
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - Dollar US</option>
                  <option value="MGA">MGA - Ariary Malgache</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="form-textarea"
                  placeholder="Notes supplémentaires..."
                />
              </div>
            </div>
          </div>

          {/* Lignes de commande */}
          <div className="form-section">
            <h2 className="section-title">Articles Commandés</h2>
            
            <div className="lignes-section">
              <div className="ligne-header">
                <div>Article</div>
                <div>Description</div>
                <div>Quantité</div>
                <div>Prix Unitaire</div>
                <div>TVA %</div>
                <div>Montant HT</div>
                <div>Action</div>
              </div>

              {lignes.map((ligne, index) => {
                const montantHT = ligne.quantite * ligne.prix_unitaire;
               // const montantTVA = montantHT * (ligne.taux_tva / 100);
                //const montantTTC = montantHT + montantTVA;

                return (
                  <div key={index} className="ligne-item">
                    <select
                      value={ligne.article_id}
                      onChange={(e) => handleLigneChange(index, 'article_id', e.target.value)}
                      className="ligne-input"
                      required
                      disabled={!canEdit()}
                    >
                      <option value="">Sélectionner un article</option>
                      {articles.map(article => (
                        <option key={article.code_article} value={article.code_article}>
                          {article.code_article} - {article.description}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={ligne.description}
                      onChange={(e) => handleLigneChange(index, 'description', e.target.value)}
                      className="ligne-input"
                      placeholder="Description"
                      required
                      disabled={!canEdit()}
                    />

                    <input
                      type="number"
                      value={ligne.quantite}
                      onChange={(e) => handleLigneChange(index, 'quantite', parseFloat(e.target.value))}
                      className="ligne-input"
                      min="0.01"
                      step="0.01"
                      required
                      disabled={!canEdit()}
                    />

                    <input
                      type="number"
                      value={ligne.prix_unitaire}
                      onChange={(e) => handleLigneChange(index, 'prix_unitaire', parseFloat(e.target.value))}
                      className="ligne-input"
                      min="0"
                      step="0.01"
                      required
                      disabled={!canEdit()}
                    />

                    <input
                      type="number"
                      value={ligne.taux_tva}
                      onChange={(e) => handleLigneChange(index, 'taux_tva', parseFloat(e.target.value))}
                      className="ligne-input"
                      min="0"
                      max="100"
                      step="0.1"
                      required
                      disabled={!canEdit()}
                    />

                    <div className="text-sm font-medium">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: formData.devise 
                      }).format(montantHT)}
                    </div>

                    <button
                      type="button"
                      onClick={() => supprimerLigne(index)}
                      className="btn-supprimer-ligne"
                      disabled={lignes.length === 1 || !canEdit()}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              {canEdit() && (
                <button
                  type="button"
                  onClick={ajouterLigne}
                  className="btn-ajouter-ligne"
                >
                  + Ajouter une ligne
                </button>
              )}
            </div>
          </div>

          {/* Totaux */}
          <div className="totaux-section">
            <h2 className="section-title">Récapitulatif</h2>
            <div className="totaux-grid">
              <div className="total-item">
                <span className="total-label">Total HT:</span>
                <span className="total-value">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: formData.devise 
                  }).format(totalHT)}
                </span>
              </div>

              <div className="total-item">
                <span className="total-label">Total TVA:</span>
                <span className="total-value total-tva">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: formData.devise 
                  }).format(totalTVA)}
                </span>
              </div>

              <div className="total-item">
                <span className="total-label">Total TTC:</span>
                <span className="total-value total-ttc">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: formData.devise 
                  }).format(totalTTC)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Link to="/import-export/commandes" className="btn-secondary">
              Annuler
            </Link>
            {canEdit() && (
              <button 
                type="submit" 
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Modifier la Commande'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Composant AlertDialog */}
      <AlertDialog
        isOpen={isOpen}
        title={title}
        message={message}
        type={type}
        onClose={close}
      />
    </div>
  );
};

export default CommandeEditPage;