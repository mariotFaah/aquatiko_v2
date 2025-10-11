// src/modules/comptabilite/pages/BilanComptablePage.tsx
import React, { useState, useEffect } from 'react';
import { rapportApi } from '../services/rapportApi';
import type { RapportBilan } from '../types';
import MontantDevise from '../components/MontantDevise/MontantDevise';
import './BilanComptablePage.css';

export const BilanComptablePage: React.FC = () => {
  const [bilan, setBilan] = useState<RapportBilan>({});
  const [loading, setLoading] = useState(false);
  const [dateBilan, setDateBilan] = useState(new Date().toISOString().split('T')[0]);

  const loadBilan = async () => {
    setLoading(true);
    try {
      const data = await rapportApi.getBilan(dateBilan);
      setBilan(data);
    } catch (error) {
      console.error('Erreur chargement bilan:', error);
      // Données de démo
      setBilan({
        '101000': { debit: 0, credit: 5000000, solde: -5000000 }, // Capital
        '211000': { debit: 2000000, credit: 0, solde: 2000000 }, // Immobilisations
        '311000': { debit: 1000000, credit: 0, solde: 1000000 }, // Stocks
        '411000': { debit: 1500000, credit: 0, solde: 1500000 }, // Clients
        '512000': { debit: 800000, credit: 0, solde: 800000 },   // Banque
        '401000': { debit: 0, credit: 1200000, solde: -1200000 }, // Fournisseurs
        '421000': { debit: 0, credit: 500000, solde: -500000 },  // Personnel
        '445710': { debit: 0, credit: 300000, solde: -300000 },  // TVA collectée
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilan();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateBilan(e.target.value);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    loadBilan();
  };

  const classerComptes = () => {
    const actif: { [key: string]: any } = {};
    const passif: { [key: string]: any } = {};

    Object.entries(bilan).forEach(([compte, details]) => {
      const numCompte = parseInt(compte);
      if (numCompte >= 1 && numCompte <= 5) {
        actif[compte] = details;
      } else {
        passif[compte] = details;
      }
    });

    return { actif, passif };
  };

  const { actif, passif } = classerComptes();

  const calculerTotalActif = () => {
    return Object.values(actif).reduce((total, compte) => total + Math.max(0, compte.solde), 0);
  };

  const calculerTotalPassif = () => {
    return Object.values(passif).reduce((total, compte) => total + Math.abs(Math.min(0, compte.solde)), 0);
  };

  const totalActif = calculerTotalActif();
  const totalPassif = calculerTotalPassif();

  const getLibelleCompte = (compte: string): string => {
    const libelles: { [key: string]: string } = {
      '101000': 'Capital social',
      '211000': 'Immobilisations corporelles',
      '311000': 'Stocks de marchandises',
      '411000': 'Clients',
      '512000': 'Compte bancaire',
      '401000': 'Fournisseurs',
      '421000': 'Personnel - Rémunérations dues',
      '445710': 'TVA collectée',
      '106000': 'Réserves',
      '120000': 'Résultat de l\'exercice'
    };
    return libelles[compte] || `Compte ${compte}`;
  };

  return (
    <div className="bilan-comptable-page">
      <div className="page-header">
        <h1>Bilan Comptable</h1>
        <p>Actif et passif à la date du bilan</p>
      </div>

      <div className="filters-section">
        <form onSubmit={handleGenerate} className="filters-form">
          <div className="filter-group">
            <label>Date du bilan</label>
            <input
              type="date"
              value={dateBilan}
              onChange={handleDateChange}
            />
          </div>
          <button type="submit" className="generate-button">
            Générer le bilan
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Génération du bilan...</div>
      ) : (
        <div className="bilan-container">
          <div className="bilan-section">
            <h2>ACTIF</h2>
            <div className="comptes-list">
              {Object.entries(actif).map(([compte, details]) => (
                <div key={compte} className="compte-line">
                  <span className="compte-number">{compte}</span>
                  <span className="compte-libelle">{getLibelleCompte(compte)}</span>
                  <span className="compte-solde actif">
                    <MontantDevise montant={Math.max(0, details.solde)} devise="MGA" />
                  </span>
                </div>
              ))}
              <div className="compte-total">
                <span className="total-label">TOTAL ACTIF</span>
                <span className="total-amount">
                  <MontantDevise montant={totalActif} devise="MGA" />
                </span>
              </div>
            </div>
          </div>

          <div className="bilan-section">
            <h2>PASSIF</h2>
            <div className="comptes-list">
              {Object.entries(passif).map(([compte, details]) => (
                <div key={compte} className="compte-line">
                  <span className="compte-number">{compte}</span>
                  <span className="compte-libelle">{getLibelleCompte(compte)}</span>
                  <span className="compte-solde passif">
                    <MontantDevise montant={Math.abs(Math.min(0, details.solde))} devise="MGA" />
                  </span>
                </div>
              ))}
              <div className="compte-total">
                <span className="total-label">TOTAL PASSIF</span>
                <span className="total-amount">
                  <MontantDevise montant={totalPassif} devise="MGA" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`bilan-equilibre ${totalActif === totalPassif ? 'equilibre' : 'desequilibre'}`}>
        {totalActif === totalPassif ? (
          <div className="equilibre-message">
            ✅ Bilan équilibré : Actif = Passif
          </div>
        ) : (
          <div className="desequilibre-message">
            ⚠️ Bilan déséquilibré : Actif ({totalActif.toLocaleString()} MGA) ≠ Passif ({totalPassif.toLocaleString()} MGA)
          </div>
        )}
      </div>
    </div>
  );
};

export default BilanComptablePage;