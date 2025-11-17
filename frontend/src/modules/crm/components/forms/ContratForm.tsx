// src/modules/crm/components/forms/ContratForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import crmApi from '../../services/api';
import './ContratForm.css';
import type { Client, Devis } from '../../types';

interface ContratFormData {
  tiers_id: number;
  devis_id?: number;
  type_contrat: string;
  date_debut: string;
  date_fin?: string;
  montant_ht: number;
  periodicite: string;
  description: string;
  conditions: string;
}

const ContratForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ContratFormData>({
    tiers_id: 0,
    devis_id: undefined,
    type_contrat: '',
    date_debut: new Date().toISOString().split('T')[0],
    date_fin: '',
    montant_ht: 0,
    periodicite: 'mensuel',
    description: '',
    conditions: ''
  });

  useEffect(() => {
    chargerDonnees();
    if (id) {
      chargerContrat(parseInt(id));
    }
  }, [id]);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      const clientsData = await crmApi.getClients();
      setClients(clientsData);
      
      const devisData = await crmApi.getDevis();
      setDevis(devisData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const chargerContrat = async (contratId: number) => {
    try {
      const contrat = await crmApi.getContrat(contratId);
      setFormData({
        tiers_id: contrat.tiers_id,
        devis_id: contrat.devis_id,
        type_contrat: contrat.type_contrat,
        date_debut: contrat.date_debut,
        date_fin: contrat.date_fin || '',
        montant_ht: contrat.montant_ht,
        periodicite: contrat.periodicite,
        description: contrat.description,
        conditions: contrat.conditions
      });
    } catch (err) {
      setError('Erreur lors du chargement du contrat');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (id) {
        await crmApi.updateContrat(parseInt(id), formData);
      } else {
        await crmApi.createContrat(formData);
      }
      navigate('/crm/contrats');
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
      [name]: name === 'montant_ht' ? parseFloat(value) || 0 : value
    }));
  };

  const handleClientChange = (clientId: number) => {
    setFormData(prev => ({
      ...prev,
      tiers_id: clientId
    }));
  };

  const typesContrat = [
    'Maintenance',
    'Consulting',
    'Formation',
    'Support',
    'Développement',
    'Infogérance',
    'Audit',
    'Autre'
  ];

  const periodicites = [
    { value: 'ponctuel', label: 'Ponctuel' },
    { value: 'mensuel', label: 'Mensuel' },
    { value: 'trimestriel', label: 'Trimestriel' },
    { value: 'semestriel', label: 'Semestriel' },
    { value: 'annuel', label: 'Annuel' }
  ];

  if (loading) return <div className="ms-loading">Chargement...</div>;

  return (
    <div className="ms-form-container">
      <div className="ms-form-header">
        <div className="ms-header-left">
          <h1 className="ms-form-title">{id ? 'Modifier le contrat' : 'Nouveau contrat'}</h1>
          {error && (
            <div className="ms-error-message">
              <span className="ms-error-icon">⚠</span>
              {error}
            </div>
          )}
        </div>
        <div className="ms-header-actions">
          <button 
            type="button" 
            onClick={() => navigate('/crm/contrats')}
            className="ms-btn ms-btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="contrat-form"
            className="ms-btn ms-btn-primary"
            disabled={saving}
          >
            {saving ? 'Sauvegarde...' : (id ? 'Mettre à jour' : 'Créer')}
          </button>
        </div>
      </div>

      <form id="contrat-form" onSubmit={handleSubmit} className="ms-form">
        <div className="ms-form-sections">
          {/* Section Informations générales */}
          <div className="ms-form-section">
            <div className="ms-section-header">
              <h2 className="ms-section-title">Informations générales</h2>
            </div>
            <div className="ms-section-content">
              <div className="ms-form-row">
                <div className="ms-form-field">
                  <label className="ms-field-label" htmlFor="tiers_id">
                    Client <span className="ms-required">*</span>
                  </label>
                  <select
                    id="tiers_id"
                    name="tiers_id"
                    className="ms-field-input"
                    value={formData.tiers_id}
                    onChange={(e) => handleClientChange(parseInt(e.target.value))}
                    required
                  >
                    <option value={0}>Sélectionner un client</option>
                    {clients.map(client => (
                      <option key={client.id_tiers} value={client.id_tiers}>
                        {client.raison_sociale || ` ${client.nom}`.trim()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ms-form-field">
                  <label className="ms-field-label" htmlFor="devis_id">
                    Devis associé
                  </label>
                  <select
                    id="devis_id"
                    name="devis_id"
                    className="ms-field-input"
                    value={formData.devis_id || ''}
                    onChange={handleChange}
                  >
                    <option value="">Aucun devis associé</option>
                    {devis.map(devisItem => (
                      <option key={devisItem.id_devis} value={devisItem.id_devis}>
                        {devisItem.numero_devis} - {devisItem.montant_ht.toLocaleString()} €
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ms-form-row">
                <div className="ms-form-field">
                  <label className="ms-field-label" htmlFor="type_contrat">
                    Type de contrat <span className="ms-required">*</span>
                  </label>
                  <select
                    id="type_contrat"
                    name="type_contrat"
                    className="ms-field-input"
                    value={formData.type_contrat}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    {typesContrat.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="ms-form-field">
                  <label className="ms-field-label" htmlFor="periodicite">
                    Périodicité <span className="ms-required">*</span>
                  </label>
                  <select
                    id="periodicite"
                    name="periodicite"
                    className="ms-field-input"
                    value={formData.periodicite}
                    onChange={handleChange}
                    required
                  >
                    {periodicites.map(periode => (
                      <option key={periode.value} value={periode.value}>
                        {periode.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section Dates et montant */}
          <div className="ms-form-section">
            <div className="ms-section-header">
              <h2 className="ms-section-title">Dates et montant</h2>
            </div>
            <div className="ms-section-content">
              <div className="ms-form-row">
                <div className="ms-form-field">
                  <label className="ms-field-label" htmlFor="date_debut">
                    Date de début <span className="ms-required">*</span>
                  </label>
                  <input
                    type="date"
                    id="date_debut"
                    name="date_debut"
                    className="ms-field-input"
                    value={formData.date_debut}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="ms-form-field">
                  <label className="ms-field-label" htmlFor="date_fin">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    id="date_fin"
                    name="date_fin"
                    className="ms-field-input"
                    value={formData.date_fin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="ms-form-row">
                <div className="ms-form-field">
                  <label className="ms-field-label" htmlFor="montant_ht">
                    Montant HT <span className="ms-required">*</span>
                  </label>
                  <div className="ms-currency-input">
                    <input
                      type="number"
                      id="montant_ht"
                      name="montant_ht"
                      className="ms-field-input"
                      value={formData.montant_ht}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                    <span className="ms-currency-symbol">€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Description */}
          <div className="ms-form-section">
            <div className="ms-section-header">
              <h2 className="ms-section-title">Description</h2>
            </div>
            <div className="ms-section-content">
              <div className="ms-form-field">
                <label className="ms-field-label" htmlFor="description">
                  Description du contrat <span className="ms-required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="ms-field-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Décrivez les prestations, objectifs, livrables..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Section Conditions */}
          <div className="ms-form-section">
            <div className="ms-section-header">
              <h2 className="ms-section-title">Conditions particulières</h2>
            </div>
            <div className="ms-section-content">
              <div className="ms-form-field">
                <label className="ms-field-label" htmlFor="conditions">
                  Conditions
                </label>
                <textarea
                  id="conditions"
                  name="conditions"
                  className="ms-field-textarea"
                  value={formData.conditions}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Conditions de paiement, clauses particulières, modalités..."
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContratForm;