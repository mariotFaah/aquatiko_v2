import React, { useState } from 'react';
import './TiersListPage.css';
import { comptabiliteApi } from '../services/api';
import type { Tiers } from '../types';

interface Props {
  tiers: Tiers | null;
  onClose: () => void;
  onSave: () => void;
}

export const TiersFormModal: React.FC<Props> = ({ tiers, onClose, onSave }) => {
  const [form, setForm] = useState<Tiers>(
    tiers || {
      id_tiers: 0,
      type_tiers: 'client',
      nom: '',
      numero: '',
      adresse: '',
      email: '',
      telephone: '',
      created_at: '',
      updated_at: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tiers) {
        await comptabiliteApi.updateTiers(form.id_tiers, form);
      } else {
        await comptabiliteApi.createTiers(form);
      }
      onSave();
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
    }
  };

  return (
    <div className="tiers-modal-overlay">
      <div className="tiers-modal">
        <h2>{tiers ? 'Modifier' : 'Ajouter'} un client/fournisseur</h2>
        <form onSubmit={handleSubmit}>
          <label>Type</label>
          <select name="type_tiers" value={form.type_tiers} onChange={handleChange}>
            <option value="client">Client</option>
            <option value="fournisseur">Fournisseur</option>
          </select>

          <label>Nom</label>
          <input name="nom" value={form.nom} onChange={handleChange} required />

          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />

          <label>Téléphone</label>
          <input name="telephone" value={form.telephone} onChange={handleChange} />

          <label>Adresse</label>
          <input name="adresse" value={form.adresse} onChange={handleChange} />

          <div className="tiers-modal-actions">
            <button type="submit" className="tiers-save-btn">Enregistrer</button>
            <button type="button" className="tiers-cancel-btn" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};
