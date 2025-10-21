import React, { useState } from 'react';
import './TiersFormModal.css';
import { comptabiliteApi } from '../services/api';
import type { Tiers } from '../types';

interface Props {
  tiers: Tiers | null;
  onClose: () => void;
  onSave: () => void;
}

// Type pour les données qu'on envoie à l'API
type TiersApiData = Omit<Tiers, 'id_tiers' | 'created_at' | 'updated_at'>;

export const TiersFormModal: React.FC<Props> = ({ tiers, onClose, onSave }) => {
  // État pour le formulaire - seulement les champs éditables
  const [form, setForm] = useState<TiersApiData>(
    tiers ? {
      type_tiers: tiers.type_tiers,
      nom: tiers.nom,
      numero: tiers.numero,
      adresse: tiers.adresse,
      email: tiers.email,
      telephone: tiers.telephone,
    } : {
      type_tiers: 'client',
      nom: '',
      numero: '',
      adresse: '',
      email: '',
      telephone: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Dans TiersFormModal.tsx - amélioration optionnelle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('📤 Données envoyées:', form);
      
      if (tiers) {
        await comptabiliteApi.updateTiers(tiers.id_tiers, form);
      } else {
        await comptabiliteApi.createTiers(form);
      }
      onSave();
    } catch (err) {
      console.error('❌ Erreur sauvegarde:', err);
      
      // Message d'erreur plus spécifique
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Erreur inconnue lors de la sauvegarde';
      
      alert(`Erreur: ${errorMessage}`);
    }
  };

  return (
    <div className="tiers-modal-overlay">
      <div className="tiers-modal">
        <h2>{tiers ? 'Modifier' : 'Ajouter'} un client/fournisseur</h2>
        <form onSubmit={handleSubmit}>
          <label>Type</label>
          <select name="type_tiers" value={form.type_tiers} onChange={handleChange} required>
            <option value="client">Client</option>
            <option value="fournisseur">Fournisseur</option>
          </select>

          <label>Nom *</label>
          <input name="nom" value={form.nom} onChange={handleChange} required />

          <label>Numéro</label>
          <input name="numero" value={form.numero} onChange={handleChange} />

          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />

          <label>Téléphone</label>
          <input name="telephone" value={form.telephone} onChange={handleChange} />

          <label>Adresse</label>
          <input name="adresse" value={form.adresse} onChange={handleChange} />

          <div className="tiers-modal-actions">
            <button type="submit" className="tiers-save-btn">
              {tiers ? 'Modifier' : 'Créer'}
            </button>
            <button type="button" className="tiers-cancel-btn" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};