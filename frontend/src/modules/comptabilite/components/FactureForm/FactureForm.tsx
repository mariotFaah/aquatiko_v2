import { useState, useEffect } from 'react';
import type { Tiers, Article, FactureFormData } from '../../types';
import { comptabiliteApi } from '../../services/api';
import { LigneFactureRow } from './LigneFactureRow';
import { CalculsFacture } from './CalculsFacture';
import './FactureForm.css';

const ENTREPRISE_INFO = {
  nom: 'Aquatiko',
  adresse: 'By pass tana 102',
  telephone: '020 22 840 61',
  email: 'aquatiko@shop.com'
};

export const FactureForm: React.FC = () => {
  const [tiers, setTiers] = useState<Tiers[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FactureFormData>({
    facture: {
      date: new Date().toISOString().split('T')[0],
      type_facture: 'facture',
      id_tiers: 0,
      echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reglement: 'virement',
      total_ht: 0,
      total_tva: 0,
      total_ttc: 0,
      statut: 'brouillon'
    },
    lignes: [
      {
        code_article: '',
        description: '',
        quantite: 1,
        prix_unitaire: 0,
        taux_tva: 20,
        remise: 0
      }
    ]
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [tiersData, articlesData] = await Promise.all([
        comptabiliteApi.getTiers(),
        comptabiliteApi.getArticles()
      ]);
      setTiers(tiersData);
      setArticles(articlesData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFactureChange = (field: keyof typeof formData.facture, value: any) => {
    setFormData(prev => ({
      ...prev,
      facture: { ...prev.facture, [field]: value }
    }));
  };

  const handleLigneChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newLignes = [...prev.lignes];
      newLignes[index] = { ...newLignes[index], [field]: value };
      
      // Si l'article change, mettre à jour la description et le prix
      if (field === 'code_article' && value) {
        const article = articles.find(a => a.code_article === value);
        if (article) {
          newLignes[index].description = article.description;
          newLignes[index].prix_unitaire = article.prix_unitaire;
          newLignes[index].taux_tva = article.taux_tva;
        }
      }
      
      return { ...prev, lignes: newLignes };
    });
  };

  const addLigne = () => {
    setFormData(prev => ({
      ...prev,
      lignes: [
        ...prev.lignes,
        {
          code_article: '',
          description: '',
          quantite: 1,
          prix_unitaire: 0,
          taux_tva: 20,
          remise: 0
        }
      ]
    }));
  };

  const removeLigne = (index: number) => {
    if (formData.lignes.length > 1) {
      setFormData(prev => ({
        ...prev,
        lignes: prev.lignes.filter((_, i) => i !== index)
      }));
    }
  };

  // Calcul des totaux pour l'affichage en temps réel
  const calculateTotals = () => {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    const lignesAvecCalculs = formData.lignes.map(ligne => {
      const montantHTSansRemise = ligne.prix_unitaire * ligne.quantite;
      const montantRemise = montantHTSansRemise * (ligne.remise / 100);
      const montantHT = montantHTSansRemise - montantRemise;
      const montantTVA = montantHT * (ligne.taux_tva / 100);
      const montantTTC = montantHT + montantTVA;

      totalHT += montantHT;
      totalTVA += montantTVA;
      totalTTC += montantTTC;

      return {
        ...ligne,
        montant_ht: montantHT,
        montant_tva: montantTVA,
        montant_ttc: montantTTC
      };
    });

    return { totalHT, totalTVA, totalTTC, lignesAvecCalculs };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.facture.id_tiers || formData.facture.id_tiers === 0) {
      alert('Veuillez sélectionner un client');
      return;
    }

    const lignesValides = formData.lignes.filter(ligne => 
      ligne.quantite > 0 && ligne.prix_unitaire >= 0
    );
    
    if (lignesValides.length === 0) {
      alert('Veuillez ajouter au moins un article avec une quantité valide');
      return;
    }

    setSubmitting(true);

    // Structure EXACTE attendue par le backend
    const payload = {
      date: formData.facture.date,
      type_facture: formData.facture.type_facture,
      id_tiers: formData.facture.id_tiers,
      echeance: formData.facture.echeance,
      reglement: formData.facture.reglement,
      lignes: formData.lignes
        .filter(ligne => ligne.quantite > 0)
        .map(ligne => ({
          code_article: ligne.code_article || undefined,
          description: ligne.description || undefined,
          quantite: ligne.quantite,
          prix_unitaire: ligne.prix_unitaire,
          taux_tva: ligne.taux_tva,
          remise: ligne.remise
        }))
    };

    console.log('Données envoyées à l\'API:', payload);

    try {
      const response = await fetch('http://localhost:3001/api/comptabilite/factures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Réponse backend:', data);

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP ${response.status}`);
      }

      if (data.success) {
        alert(`✅ Facture ${data.data.numero_facture} créée avec succès!`);
        // Réinitialiser le formulaire
        setFormData({
          facture: {
            date: new Date().toISOString().split('T')[0],
            type_facture: 'facture',
            id_tiers: 0,
            echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            reglement: 'virement',
            total_ht: 0,
            total_tva: 0,
            total_ttc: 0,
            statut: 'brouillon'
          },
          lignes: [
            {
              code_article: '',
              description: '',
              quantite: 1,
              prix_unitaire: 0,
              taux_tva: 20,
              remise: 0
            }
          ]
        });
      } else {
        throw new Error(data.message || 'Erreur inconnue du serveur');
      }
    } catch (error: any) {
      console.error('Erreur détaillée création facture:', error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTier = tiers.find(t => t.id_tiers === formData.facture.id_tiers);
  const { totalHT, totalTVA, totalTTC, lignesAvecCalculs } = calculateTotals();

  if (loading) {
    return (
      <div className="facture-loading">
        <div className="facture-loading-text">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="facture-form">
      {/* En-tête Facture */}
      <div className="facture-header">
        <div>
          <h2 className="facture-title">FACTURE</h2>
          <div className="facture-info">
            <div><strong>Date:</strong> {new Date(formData.facture.date).toLocaleDateString('fr-FR')}</div>
            <div><strong>Facture No:</strong> Nouvelle</div>
          </div>
        </div>
        
        <div>
          <h3 className="facture-section-title">Entreprise</h3>
          <div className="facture-entreprise-info">
            <div><strong>Nom:</strong> {ENTREPRISE_INFO.nom}</div>
            <div><strong>Adresse:</strong> {ENTREPRISE_INFO.adresse}</div>
            <div><strong>Tel:</strong> {ENTREPRISE_INFO.telephone}</div>
            <div><strong>Email:</strong> {ENTREPRISE_INFO.email}</div>
          </div>
        </div>
        
        <div>
          <h3 className="facture-section-title">Client</h3>
          <select
            value={formData.facture.id_tiers}
            onChange={(e) => handleFactureChange('id_tiers', parseInt(e.target.value))}
            className="facture-client-select"
            required
          >
            <option value={0}>Sélectionner un client</option>
            {tiers.filter(t => t.type_tiers === 'client').map(tier => (
              <option key={tier.id_tiers} value={tier.id_tiers}>
                {tier.nom} - {tier.numero}
              </option>
            ))}
          </select>
          
          {selectedTier && (
            <div className="facture-client-details">
              <div><strong>Nom:</strong> {selectedTier.nom}</div>
              <div><strong>Adresse:</strong> {selectedTier.adresse}</div>
              <div><strong>Tel:</strong> {selectedTier.telephone}</div>
              <div><strong>Email:</strong> {selectedTier.email}</div>
            </div>
          )}
        </div>
      </div>

      {/* Informations facture */}
      <div className="facture-details">
        <div className="facture-field">
          <label className="facture-label">
            Type de facture
          </label>
          <select
            value={formData.facture.type_facture}
            onChange={(e) => handleFactureChange('type_facture', e.target.value)}
            className="facture-select"
          >
            <option value="facture">Facture</option>
            <option value="proforma">Proforma</option>
            <option value="avoir">Avoir</option>
          </select>
        </div>
        
        <div className="facture-field">
          <label className="facture-label">
            Mode de règlement
          </label>
          <select
            value={formData.facture.reglement}
            onChange={(e) => handleFactureChange('reglement', e.target.value)}
            className="facture-select"
          >
            <option value="virement">Virement</option>
            <option value="cheque">Chèque</option>
            <option value="espece">Espèce</option>
            <option value="carte">Carte</option>
          </select>
        </div>
        
        <div className="facture-field">
          <label className="facture-label">
            Date d'échéance
          </label>
          <input
            type="date"
            value={formData.facture.echeance}
            onChange={(e) => handleFactureChange('echeance', e.target.value)}
            className="facture-input"
          />
        </div>
      </div>

      {/* Lignes de facture */}
      <div className="facture-articles-section">
        <div className="facture-articles-header">
          <h3 className="facture-articles-title">Articles et Services</h3>
          <button
            type="button"
            onClick={addLigne}
            className="facture-add-button"
          >
            + Ajouter une ligne
          </button>
        </div>

        <div className="facture-table-container">
          <table className="facture-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Libellé</th>
                <th>PU</th>
                <th>Quantité</th>
                <th>Remise %</th>
                <th>Montant HT</th>
                <th>TVA %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lignesAvecCalculs.map((ligne, index) => (
                <LigneFactureRow
                  key={index}
                  ligne={ligne}
                  articles={articles}
                  index={index}
                  onChange={handleLigneChange}
                  onRemove={removeLigne}
                  showRemove={formData.lignes.length > 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totaux */}
      <CalculsFacture 
        totalHT={totalHT}
        totalTVA={totalTVA}
        totalTTC={totalTTC}
        echeance={formData.facture.echeance}
        reglement={formData.facture.reglement}
      />

      {/* Boutons d'action */}
      <div className="facture-actions">
        <button
          type="button"
          className="facture-draft-button"
          disabled={submitting}
        >
          Enregistrer Brouillon
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={submitting}
          className="facture-submit-button"
        >
          {submitting ? 'Création en cours...' : 'Créer la Facture'}
        </button>
      </div>
    </div>
  );
};

export default FactureForm;