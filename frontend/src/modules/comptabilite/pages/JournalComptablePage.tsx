// src/modules/comptabilite/pages/JournalComptablePage.tsx
import React, { useState, useEffect } from 'react';
import ecritureApi from '../services/ecritureApi';  // ✅ Nom correct
import type { EcritureComptable } from '../types';
import MontantDevise from '../components/MontantDevise/MontantDevise';
import './JournalComptablePage.css';

export const JournalComptablePage: React.FC = () => {
  const [ecritures, setEcritures] = useState<EcritureComptable[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    date_debut: '',
    date_fin: '',
    journal: ''
  });

  const loadEcritures = async () => {
    setLoading(true);
    try {
      const data = await ecritureApi.getEcrituresComptables(filters);  // ✅ ecritureApi
      setEcritures(data);
    } catch (error) {
      console.error('Erreur chargement écritures:', error);
      alert('Erreur lors du chargement des écritures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEcritures();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadEcritures();
  };

  const getJournalColor = (journal: string) => {
    const colors: { [key: string]: string } = {
      'ventes': 'journal-ventes',
      'achats': 'journal-achats',
      'banque': 'journal-banque',
      'caisse': 'journal-caisse'
    };
    return colors[journal] || '';
  };

  const calculerTotaux = () => {
    const totalDebit = ecritures.reduce((sum, ecriture) => sum + ecriture.debit, 0);
    const totalCredit = ecritures.reduce((sum, ecriture) => sum + ecriture.credit, 0);
    return { totalDebit, totalCredit };
  };

  const { totalDebit, totalCredit } = calculerTotaux();

  return (
    <div className="journal-comptable-page">
      <div className="page-header">
        <h1>Journal Comptable</h1>
        <p>Consultation des écritures comptables</p>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="filters-form">
          <div className="filter-group">
            <label>Date début</label>
            <input
              type="date"
              value={filters.date_debut}
              onChange={(e) => handleFilterChange('date_debut', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Date fin</label>
            <input
              type="date"
              value={filters.date_fin}
              onChange={(e) => handleFilterChange('date_fin', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Journal</label>
            <select
              value={filters.journal}
              onChange={(e) => handleFilterChange('journal', e.target.value)}
            >
              <option value="">Tous les journaux</option>
              <option value="ventes">Ventes</option>
              <option value="achats">Achats</option>
              <option value="banque">Banque</option>
              <option value="caisse">Caisse</option>
            </select>
          </div>

          <button type="submit" className="search-button">
            Rechercher
          </button>
        </form>
      </div>

      {/* Résultats */}
      <div className="results-section">
        {loading ? (
          <div className="loading">Chargement des écritures...</div>
        ) : (
          <>
            <div className="table-container">
              <table className="ecritures-table">
                <thead>
                  <tr>
                    <th>N° Écriture</th>
                    <th>Date</th>
                    <th>Journal</th>
                    <th>Compte</th>
                    <th>Libellé</th>
                    <th>Débit</th>
                    <th>Crédit</th>
                    <th>Devise</th>
                  </tr>
                </thead>
                <tbody>
                  {ecritures.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="no-data">
                        Aucune écriture trouvée
                      </td>
                    </tr>
                  ) : (
                    ecritures.map((ecriture) => (
                      <tr key={ecriture.id_ecriture}>
                        <td className="numero">{ecriture.numero_ecriture}</td>
                        <td className="date">
                          {new Date(ecriture.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td>
                          <span className={`journal-badge ${getJournalColor(ecriture.journal)}`}>
                            {ecriture.journal}
                          </span>
                        </td>
                        <td className="compte">{ecriture.compte}</td>
                        <td className="libelle">{ecriture.libelle}</td>
                        <td className="debit">
                          {ecriture.debit > 0 && (
                            <MontantDevise 
                              montant={ecriture.debit} 
                              devise={ecriture.devise} 
                            />
                          )}
                        </td>
                        <td className="credit">
                          {ecriture.credit > 0 && (
                            <MontantDevise 
                              montant={ecriture.credit} 
                              devise={ecriture.devise} 
                            />
                          )}
                        </td>
                        <td className="devise">{ecriture.devise}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="totals-row">
                    <td colSpan={5} className="totals-label">Totaux</td>
                    <td className="total-debit">
                      <MontantDevise montant={totalDebit} devise="MGA" />
                    </td>
                    <td className="total-credit">
                      <MontantDevise montant={totalCredit} devise="MGA" />
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Débit</h3>
                <div className="amount debit">
                  <MontantDevise montant={totalDebit} devise="MGA" />
                </div>
              </div>
              <div className="summary-card">
                <h3>Total Crédit</h3>
                <div className="amount credit">
                  <MontantDevise montant={totalCredit} devise="MGA" />
                </div>
              </div>
              <div className="summary-card">
                <h3>Équilibre</h3>
                <div className={`amount ${totalDebit === totalCredit ? 'balanced' : 'unbalanced'}`}>
                  {totalDebit === totalCredit ? '✓ Équilibré' : '✗ Déséquilibré'}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JournalComptablePage;