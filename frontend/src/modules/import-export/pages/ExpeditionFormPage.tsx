import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { importExportApi } from '../services/api';
import type { Commande, ExpeditionFormData } from '../types';
import './ExpeditionFormPage.css';

const ExpeditionFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ExpeditionFormData>({
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
    loadCommande();
  }, [id]);

  const loadCommande = async () => {
    try {
      const data = await importExportApi.getCommande(parseInt(id!));
      setCommande(data);
      
      // Pré-remplir le formulaire si une expédition existe
      if (data.expedition) {
        setFormData(prev => ({
          ...prev,
          numero_bl: data.expedition!.numero_bl || '',
          numero_connaissement: data.expedition!.numero_connaissement || '',
          numero_packing_list: data.expedition!.numero_packing_list || '',
          date_expedition: data.expedition!.date_expedition ? data.expedition!.date_expedition.split('T')[0] : '',
          date_arrivee_prevue: data.expedition!.date_arrivee_prevue ? data.expedition!.date_arrivee_prevue.split('T')[0] : '',
          transporteur: data.expedition!.transporteur || '',
          mode_transport: data.expedition!.mode_transport || '',
          instructions_speciales: data.expedition!.instructions_speciales || '',
          statut: data.expedition!.statut
        }));
      }
    } catch (error) {
      console.error('Erreur chargement commande:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ExpeditionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await importExportApi.updateExpedition(formData);
      alert('Expédition enregistrée avec succès!');
      navigate(`/import-export/commandes/${id}`);
    } catch (error) {
      console.error('Erreur sauvegarde expédition:', error);
      alert('Erreur lors de la sauvegarde de l\'expédition');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="expedition-form-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="expedition-form-container">
        <div className="empty-state">
          <h2>Commande non trouvée</h2>
          <Link to="/import-export/commandes" className="btn-primary">
            Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="expedition-form-container">
      <div className="expedition-form-content">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>Gestion de l'Expédition</h1>
            <div className="header-subtitle">
              <span className="commande-ref">{commande.numero_commande}</span>
              <span className="separator">•</span>
              <span className="commande-type">
                {commande.type === 'import' ? '📥 Import' : '📤 Export'}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <Link 
              to={`/import-export/commandes/${commande.id}`}
              className="btn-secondary"
            >
              ← Retour à la commande
            </Link>
          </div>
        </div>

        <div className="form-section">
          <div className="form-card">
            <h2>Informations d'Expédition</h2>
            
            <div className="form-grid">
              {/* Statut */}
              <div className="form-group">
                <label>Statut de l'expédition</label>
                <select
                  value={formData.statut}
                  onChange={(e) => handleInputChange('statut', e.target.value)}
                  className="form-input"
                >
                  <option value="preparation">En préparation</option>
                  <option value="expédiée">Expédiée</option>
                  <option value="transit">En transit</option>
                  <option value="arrivée">Arrivée</option>
                  <option value="livrée">Livrée</option>
                </select>
              </div>

              {/* Transporteur */}
              <div className="form-group">
                <label>Transporteur</label>
                <input
                  type="text"
                  value={formData.transporteur}
                  onChange={(e) => handleInputChange('transporteur', e.target.value)}
                  className="form-input"
                  placeholder="Nom du transporteur"
                />
              </div>

              {/* Mode de transport */}
              <div className="form-group">
                <label>Mode de transport</label>
                <select
                  value={formData.mode_transport}
                  onChange={(e) => handleInputChange('mode_transport', e.target.value)}
                  className="form-input"
                >
                  <option value="">Sélectionnez un mode</option>
                  <option value="maritime">Maritime</option>
                  <option value="aerien">Aérien</option>
                  <option value="terrestre">Terrestre</option>
                  <option value="multimodal">Multimodal</option>
                </select>
              </div>

              {/* Date d'expédition */}
              <div className="form-group">
                <label>Date d'expédition</label>
                <input
                  type="date"
                  value={formData.date_expedition}
                  onChange={(e) => handleInputChange('date_expedition', e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Date d'arrivée prévue */}
              <div className="form-group">
                <label>Date d'arrivée prévue</label>
                <input
                  type="date"
                  value={formData.date_arrivee_prevue}
                  onChange={(e) => handleInputChange('date_arrivee_prevue', e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Numéro BL */}
              <div className="form-group">
                <label>Numéro de Bon de Livraison</label>
                <input
                  type="text"
                  value={formData.numero_bl}
                  onChange={(e) => handleInputChange('numero_bl', e.target.value)}
                  className="form-input"
                  placeholder="BL-XXXXXX"
                />
              </div>

              {/* Numéro connaissement */}
              <div className="form-group">
                <label>Numéro de Connaissement</label>
                <input
                  type="text"
                  value={formData.numero_connaissement}
                  onChange={(e) => handleInputChange('numero_connaissement', e.target.value)}
                  className="form-input"
                  placeholder="CON-XXXXXX"
                />
              </div>

              {/* Numéro packing list */}
              <div className="form-group">
                <label>Numéro de Packing List</label>
                <input
                  type="text"
                  value={formData.numero_packing_list}
                  onChange={(e) => handleInputChange('numero_packing_list', e.target.value)}
                  className="form-input"
                  placeholder="PL-XXXXXX"
                />
              </div>

              {/* Instructions spéciales */}
              <div className="form-group full-width">
                <label>Instructions spéciales</label>
                <textarea
                  value={formData.instructions_speciales}
                  onChange={(e) => handleInputChange('instructions_speciales', e.target.value)}
                  className="form-textarea"
                  placeholder="Instructions particulières pour l'expédition..."
                  rows={4}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="btn-save"
              >
                {saving ? '💾 Enregistrement...' : '💾 Enregistrer l\'expédition'}
              </button>
              <Link 
                to={`/import-export/commandes/${commande.id}`}
                className="btn-cancel"
              >
                Annuler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpeditionFormPage;
