// src/modules/crm/components/forms/DevisForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import crmApi from '../../services/api';
import './DevisForm.css';

interface DevisFormData {
  tiers_id: number;
  date_devis: string;
  date_validite: string;
  objet: string;
  montant_ht: number;
  conditions: string;
}

interface Client {
  id_tiers: number;
  nom: string;
  prenom?: string;
  raison_sociale: string;
}

interface LigneDevis {
  id?: number;
  description: string;
  quantite: number;
  prix_unitaire: number;
  tva: number;
  montant_ht: number;
  montant_ttc: number;
}

const DevisForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<DevisFormData>({
    tiers_id: 0,
    date_devis: new Date().toISOString().split('T')[0],
    date_validite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 jours
    objet: '',
    montant_ht: 0,
    conditions: 'Paiement à 30 jours fin de mois\nValidité 30 jours'
  });

  const [lignesDevis, setLignesDevis] = useState<LigneDevis[]>([
    {
      description: '',
      quantite: 1,
      prix_unitaire: 0,
      tva: 20,
      montant_ht: 0,
      montant_ttc: 0
    }
  ]);

  useEffect(() => {
    chargerDonnees();
    if (id) {
      chargerDevis(parseInt(id));
    }
  }, [id]);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      const clientsData = await crmApi.getClients();
      setClients(clientsData);
    } catch (err) {
      setError('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const chargerDevis = async (devisId: number) => {
    try {
      const devis = await crmApi.getDevisById(devisId);
      setFormData({
        tiers_id: devis.tiers_id ?? 0,
        date_devis: devis.date_devis ?? new Date().toISOString().split('T')[0],
        date_validite: devis.date_validite ?? '',
        objet: devis.objet ?? '',
        montant_ht: devis.montant_ht ?? 0,
        conditions: devis.conditions ?? ''
      });
      // Note: Pour les lignes de devis, vous devrez implémenter une API spécifique
    } catch (err) {
      setError('Erreur lors du chargement du devis');
    }
  };

  const calculerMontantsLigne = (ligne: LigneDevis): LigneDevis => {
    const montantHt = ligne.quantite * ligne.prix_unitaire;
    const montantTtc = montantHt * (1 + ligne.tva / 100);
    return {
      ...ligne,
      montant_ht: montantHt,
      montant_ttc: montantTtc
    };
  };

  const calculerTotalDevis = () => {
    const totalHt = lignesDevis.reduce((sum, ligne) => sum + ligne.montant_ht, 0);
    const totalTtc = lignesDevis.reduce((sum, ligne) => sum + ligne.montant_ttc, 0);
    return { totalHt, totalTtc };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { totalHt } = calculerTotalDevis();

    try {
      const devisData = {
        ...formData,
        montant_ht: totalHt
      };

      if (id) {
        await crmApi.updateDevis(parseInt(id), devisData);
      } else {
        await crmApi.createDevis(devisData);
      }
      navigate('/crm/devis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLigneChange = (index: number, field: string, value: string | number) => {
    const nouvellesLignes = [...lignesDevis];
    nouvellesLignes[index] = {
      ...nouvellesLignes[index],
      [field]: typeof value === 'string' && field !== 'description' ? parseFloat(value) || 0 : value
    };
    
    // Recalculer les montants de la ligne modifiée
    nouvellesLignes[index] = calculerMontantsLigne(nouvellesLignes[index]);
    
    setLignesDevis(nouvellesLignes);
  };

  const ajouterLigne = () => {
    setLignesDevis(prev => [
      ...prev,
      {
        description: '',
        quantite: 1,
        prix_unitaire: 0,
        tva: 20,
        montant_ht: 0,
        montant_ttc: 0
      }
    ]);
  };

  const supprimerLigne = (index: number) => {
    if (lignesDevis.length > 1) {
      setLignesDevis(prev => prev.filter((_, i) => i !== index));
    }
  };

  const tauxTVA = [0, 2.1, 5.5, 10, 20];

  const { totalHt, totalTtc } = calculerTotalDevis();

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="devis-form-page">
      <div className="page-header">
        <h1>{id ? 'Modifier le devis' : 'Nouveau devis'}</h1>
        <button 
          type="button" 
          onClick={() => navigate('/crm/devis')}
          className="btn-secondary"
        >
          Annuler
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="devis-form">
        <div className="form-grid">
          {/* Informations de base */}
          <div className="form-section">
            <h3>Informations du devis</h3>
            
            <div className="form-group">
              <label htmlFor="tiers_id">Client *</label>
              <select
                id="tiers_id"
                name="tiers_id"
                value={formData.tiers_id}
                onChange={handleChange}
                required
              >
                <option value={0}>Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id_tiers} value={client.id_tiers}>
                    {client.raison_sociale || `${client.prenom} ${client.nom}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date_devis">Date du devis *</label>
                <input
                  type="date"
                  id="date_devis"
                  name="date_devis"
                  value={formData.date_devis}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_validite">Date de validité *</label>
                <input
                  type="date"
                  id="date_validite"
                  name="date_validite"
                  value={formData.date_validite}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="objet">Objet du devis *</label>
              <input
                type="text"
                id="objet"
                name="objet"
                value={formData.objet}
                onChange={handleChange}
                placeholder="Description de la prestation..."
                required
              />
            </div>
          </div>

          {/* Lignes du devis */}
          <div className="form-section full-width">
            <div className="section-header">
              <h3>Prestations</h3>
              <button 
                type="button" 
                onClick={ajouterLigne}
                className="btn-add-line"
              >
                + Ajouter une ligne
              </button>
            </div>

            <div className="lignes-devis">
              <div className="ligne-header">
                <div className="col-description">Description</div>
                <div className="col-quantite">Quantité</div>
                <div className="col-prix">Prix unitaire HT</div>
                <div className="col-tva">TVA</div>
                <div className="col-montant">Montant HT</div>
                <div className="col-actions">Actions</div>
              </div>

              {lignesDevis.map((ligne, index) => (
                <div key={index} className="ligne-devis">
                  <div className="col-description">
                    <input
                      type="text"
                      value={ligne.description}
                      onChange={(e) => handleLigneChange(index, 'description', e.target.value)}
                      placeholder="Description de la prestation"
                      required
                    />
                  </div>
                  
                  <div className="col-quantite">
                    <input
                      type="number"
                      value={ligne.quantite}
                      onChange={(e) => handleLigneChange(index, 'quantite', e.target.value)}
                      min="1"
                      step="1"
                      required
                    />
                  </div>
                  
                  <div className="col-prix">
                    <input
                      type="number"
                      value={ligne.prix_unitaire}
                      onChange={(e) => handleLigneChange(index, 'prix_unitaire', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                    <span className="currency">€</span>
                  </div>
                  
                  <div className="col-tva">
                    <select
                      value={ligne.tva}
                      onChange={(e) => handleLigneChange(index, 'tva', parseFloat(e.target.value))}
                    >
                      {tauxTVA.map(taux => (
                        <option key={taux} value={taux}>
                          {taux}%
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-montant">
                    <span className="montant-ht">
                      {ligne.montant_ht.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                  
                  <div className="col-actions">
                    {lignesDevis.length > 1 && (
                      <button
                        type="button"
                        onClick={() => supprimerLigne(index)}
                        className="btn-delete"
                        title="Supprimer cette ligne"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="totaux-section">
              <div className="total-line">
                <span className="total-label">Total HT:</span>
                <span className="total-value">{totalHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className="total-line">
                <span className="total-label">Total TTC:</span>
                <span className="total-value total-ttc">
                  {totalTtc.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="form-section full-width">
            <h3>Conditions générales</h3>
            <div className="form-group">
              <label htmlFor="conditions">Conditions (optionnel)</label>
              <textarea
                id="conditions"
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
                rows={4}
                placeholder="Conditions de paiement, délais, modalités..."
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/crm/devis')}
            className="btn-cancel"
            disabled={saving}
          >
            Annuler
          </button>
          <div className="action-buttons">
            <button
              type="submit"
              name="statut"
              value="brouillon"
              className="btn-save-draft"
              disabled={saving}
            >
              {saving ? 'Sauvegarde...' : 'Enregistrer brouillon'}
            </button>
            <button
              type="submit"
              name="statut"
              value="envoye"
              className="btn-submit"
              disabled={saving}
            >
              {saving ? 'Envoi...' : 'Envoyer le devis'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DevisForm;