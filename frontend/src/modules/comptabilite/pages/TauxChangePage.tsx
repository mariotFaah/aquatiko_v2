// src/modules/comptabilite/pages/TauxChangePage.tsx
import React, { useState, useEffect } from 'react';
import { deviseApi } from '../services/deviseApi';
import type { TauxChange } from '../types';
import TauxChangeCalculator from '../components/TauxChangeCalculator/TauxChangeCalculator';
import { useAlertDialog } from '../../../core/hooks/useAlertDialog';
import AlertDialog from '../../../core/components/AlertDialog/AlertDialog';
import './TauxChangePage.css';

export const TauxChangePage: React.FC = () => {
  const [tauxChanges, setTauxChanges] = useState<TauxChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    devise_source: 'MGA',
    devise_cible: 'USD',
    taux: 0,
    date_effet: new Date().toISOString().split('T')[0]
  });

  // Utilisation du hook AlertDialog
  const { isOpen, message, title, type, alert, close } = useAlertDialog();

  const loadTauxChanges = async () => {
    setLoading(true);
    try {
      const data = await deviseApi.getTauxChange();
      setTauxChanges(data);
    } catch (error) {
      console.error('Erreur chargement taux change:', error);
      // Données de démo
      setTauxChanges([
        {
          id_taux: 1,
          devise_source: 'MGA',
          devise_cible: 'USD',
          taux: 0.00022,
          date_effet: new Date().toISOString().split('T')[0],
          actif: true
        },
        {
          id_taux: 2,
          devise_source: 'USD',
          devise_cible: 'MGA',
          taux: 4500,
          date_effet: new Date().toISOString().split('T')[0],
          actif: true
        },
        {
          id_taux: 3,
          devise_source: 'MGA',
          devise_cible: 'EUR',
          taux: 0.00020,
          date_effet: new Date().toISOString().split('T')[0],
          actif: true
        }
      ]);

      // Afficher un avertissement avec AlertDialog
      alert('Chargement des taux échoué, affichage des données de démo', {
        type: 'warning',
        title: 'Avertissement'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTauxChanges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation du taux
    if (formData.taux <= 0) {
      alert('Le taux de change doit être supérieur à 0', {
        type: 'warning',
        title: 'Taux invalide'
      });
      return;
    }

    // Validation des devises différentes
    if (formData.devise_source === formData.devise_cible) {
      alert('Les devises source et cible doivent être différentes', {
        type: 'warning',
        title: 'Devises identiques'
      });
      return;
    }

    try {
      await deviseApi.createTauxChange({
        ...formData,
        actif: true
      });
      setShowForm(false);
      setFormData({
        devise_source: 'MGA',
        devise_cible: 'USD',
        taux: 0,
        date_effet: new Date().toISOString().split('T')[0]
      });
      loadTauxChanges();
      
      // Message de succès avec AlertDialog
      alert('Taux de change ajouté avec succès', {
        type: 'success',
        title: 'Succès'
      });
    } catch (error) {
      console.error('Erreur création taux change:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erreur inconnue lors de l\'ajout';
      
      alert(`Erreur lors de l'ajout du taux de change: ${errorMessage}`, {
        type: 'error',
        title: 'Erreur'
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const devises = ['MGA', 'USD', 'EUR'];

  return (
    <div className="taux-change-page">
      <div className="page-header">
        <h1>Gestion des Taux de Change</h1>
        <p>Configuration des taux de change multi-devises</p>
      </div>

      <div className="page-layout">
        {/* Calculateur */}
        <div className="calculator-section">
          <TauxChangeCalculator />
        </div>

        {/* Liste des taux */}
        <div className="taux-list-section">
          <div className="section-header">
            <h2>Taux de Change Configurés</h2>
            <button 
              className="add-button"
              onClick={() => setShowForm(true)}
            >
              + Ajouter un taux
            </button>
          </div>

          {loading ? (
            <div className="loading">Chargement des taux de change...</div>
          ) : (
            <div className="taux-grid">
              {tauxChanges.map((taux) => (
                <div key={taux.id_taux} className="taux-card">
                  <div className="taux-pair">
                    <span className="devise-source">1 {taux.devise_source}</span>
                    <span className="equals">=</span>
                    {/* CORRECTION: s'assurer que taux.taux est un nombre */}
                    <span className="taux-value">
                      {typeof taux.taux === 'number' ? taux.taux.toFixed(6) : parseFloat(taux.taux).toFixed(6)}
                    </span>
                    <span className="devise-cible">{taux.devise_cible}</span>
                  </div>
                  <div className="taux-meta">
                    <span className="date">Effet: {new Date(taux.date_effet).toLocaleDateString('fr-FR')}</span>
                    <span className={`status ${taux.actif ? 'actif' : 'inactif'}`}>
                      {taux.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Nouveau Taux de Change</h3>
              <button 
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="taux-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Devise Source</label>
                  <select
                    value={formData.devise_source}
                    onChange={(e) => handleInputChange('devise_source', e.target.value)}
                    required
                  >
                    {devises.map(devise => (
                      <option key={devise} value={devise}>{devise}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Devise Cible</label>
                  <select
                    value={formData.devise_cible}
                    onChange={(e) => handleInputChange('devise_cible', e.target.value)}
                    required
                  >
                    {devises.map(devise => (
                      <option key={devise} value={devise}>{devise}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Taux de Change</label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.taux}
                  onChange={(e) => handleInputChange('taux', parseFloat(e.target.value))}
                  placeholder="0.000000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date d'effet</label>
                <input
                  type="date"
                  value={formData.date_effet}
                  onChange={(e) => handleInputChange('date_effet', e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="cancel-button"
                >
                  Annuler
                </button>
                <button type="submit" className="primary save-button">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default TauxChangePage;