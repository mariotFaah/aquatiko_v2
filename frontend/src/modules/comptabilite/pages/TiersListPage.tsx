import React, { useState, useEffect } from 'react';
import './TiersListPage.css';
import { comptabiliteApi } from '../services/api';
import type { Tiers } from '../types';
import { TiersFormModal } from './TiersFormModal';

export const TiersListPage: React.FC = () => {
  const [tiers, setTiers] = useState<Tiers[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTiers, setSelectedTiers] = useState<Tiers | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadTiers();
  }, []);

// Dans TiersListPage.tsx - améliorer loadTiers
const loadTiers = async () => {
  try {
    setLoading(true);
    const data = await comptabiliteApi.getTiers();
    console.log('📋 Tiers chargés:', data); // Debug
    setTiers(data);
  } catch (err) {
    console.error('Erreur lors du chargement des tiers:', err);
    // En cas d'erreur, définir un tableau vide pour éviter les crashs
    setTiers([]);
    alert('Erreur lors du chargement des clients/fournisseurs');
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce client/fournisseur ?')) return;
    try {
      await comptabiliteApi.deleteTiers(id);
      loadTiers();
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const handleEdit = (tiers: Tiers) => {
    setSelectedTiers(tiers);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedTiers(null);
    setShowModal(true);
  };

  if (loading) {
    return <div className="tiers-loading">Chargement des données...</div>;
  }

  return (
    <div className="tiers-page">
      <div className="tiers-header">
        <div>
          <h1 className="tiers-title">Clients & Fournisseurs</h1>
          <p className="tiers-subtitle">Gérez vos contacts (clients et fournisseurs)</p>
        </div>
        <button className="tiers-add-btn" onClick={handleAdd}>+ Nouveau</button>
      </div>

      <div className="tiers-table-container">
        <table className="tiers-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map(t => (
              <tr key={t.id_tiers}>
                <td>{t.nom}</td>
                <td>{t.type_tiers}</td>
                <td>{t.email}</td>
                <td>{t.telephone}</td>
                <td>{t.adresse}</td>
                <td className="tiers-actions">
                  <button className="tiers-edit-btn" onClick={() => handleEdit(t)}>Modifier</button>
                  <button className="tiers-delete-btn" onClick={() => handleDelete(t.id_tiers)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tiers.length === 0 && <div className="tiers-empty">Aucun client ni fournisseur trouvé.</div>}
      </div>

      {showModal && (
        <TiersFormModal
          tiers={selectedTiers}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            loadTiers();
          }}
        />
      )}
    </div>
  );
};
