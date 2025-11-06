import { useState, useEffect } from 'react';
import type { Tiers, Article, FactureFormData, Facture, TauxChange, PaiementFlexibleConfig } from '../../types';
import { comptabiliteApi } from '../../services/api';
import { LigneFactureRow } from './LigneFactureRow';
import { CalculsFacture } from './CalculsFacture';
import { DeviseSelector } from '../DeviseSelector/DeviseSelector';
import { useAlertDialog } from '../../../../core/hooks/useAlertDialog';
import AlertDialog from '../../../../core/components/AlertDialog/AlertDialog';
import './FactureForm.css';

const ENTREPRISE_INFO = {
  nom: 'OMNISERVE EXPERTS',
  adresse: '2239 Ambodisaina Ivondro Tamatave',
  telephone: '+261 32 77 531 69',
  email: 'contact@omniserve.experts'
};

const safeToFixed = (value: any, decimals: number = 2): number => {
  if (value == null || value === '') return 0;
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) {
    console.warn('Valeur invalide pour toFixed:', value);
    return 0;
  }
  return Number(num.toFixed(decimals));
};

export const FactureForm: React.FC = () => {
  const [tiers, setTiers] = useState<Tiers[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tauxChange, setTauxChange] = useState<TauxChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [factureCreee, setFactureCreee] = useState<Facture | null>(null);
  
  // Utilisation du hook AlertDialog
  const { isOpen, message, title, type, alert, close } = useAlertDialog();

  // État pour la configuration du paiement flexible
  const [paiementFlexible, setPaiementFlexible] = useState<PaiementFlexibleConfig>({
    type_paiement: 'comptant',
    date_finale_paiement: '',
    montant_minimum_paiement: 0,
    penalite_retard: 0,
    montant_acompte: 0,
    mode_paiement_acompte: 'virement'
  });

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
      statut: 'brouillon',
      devise: 'MGA',
      taux_change: 1.0
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

  useEffect(() => {
    const { totalHT, totalTVA, totalTTC } = calculateTotals();
    
    setFormData(prev => ({
      ...prev,
      facture: {
        ...prev.facture,
        total_ht: totalHT,
        total_tva: totalTVA,
        total_ttc: totalTTC
      }
    }));

    // Mettre à jour le montant d'acompte si le type est "acompte"
    if (paiementFlexible.type_paiement === 'acompte') {
      const acompteCalcul = totalTTC * 0.3; // 30% par défaut
      setPaiementFlexible(prev => ({
        ...prev,
        montant_acompte: safeToFixed(acompteCalcul)
      }));
    }
  }, [formData.lignes, paiementFlexible.type_paiement]);

  const loadInitialData = async () => {
    try {
      const [tiersData, articlesData, tauxChangeData] = await Promise.all([
        comptabiliteApi.getTiers(),
        comptabiliteApi.getArticles(),
        comptabiliteApi.getTauxChange()
      ]);
      setTiers(tiersData);
      setArticles(articlesData);
      setTauxChange(tauxChangeData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      alert('Erreur lors du chargement des données initiales', {
        type: 'error',
        title: 'Erreur de chargement'
      });
    } finally {
      setLoading(false);
    }
  };

  const convertirPrix = (prixMGA: number, deviseCible: string): number => {
    if (deviseCible === 'MGA') {
      return prixMGA;
    }

    const taux = tauxChange.find(t => 
      t.devise_source === deviseCible && t.devise_cible === 'MGA' && t.actif
    );
    
    if (!taux) {
      console.warn(`Taux de change non trouvé pour ${deviseCible} -> MGA`);
      return prixMGA;
    }

    const prixConverti = prixMGA / taux.taux;
    
    return safeToFixed(prixConverti);
  };

  const convertirVersMGA = (prix: number, deviseSource: string): number => {
    if (deviseSource === 'MGA') {
      return prix;
    }

    const taux = tauxChange.find(t => 
      t.devise_source === deviseSource && t.devise_cible === 'MGA' && t.actif
    );
    
    if (!taux) {
      console.warn(`Taux de change non trouvé pour ${deviseSource} -> MGA`);
      return prix;
    }

    return prix * taux.taux;
  };

  const getCurrentDevise = (): string => {
    return formData.facture.devise || 'MGA';
  };

  const handleDeviseChange = async (nouvelleDevise: string) => {
    try {
      const taux = tauxChange.find(t => 
        t.devise_source === nouvelleDevise && t.devise_cible === 'MGA' && t.actif
      );
      
      if (!taux && nouvelleDevise !== 'MGA') {
        alert(`Taux de change non trouvé pour ${nouvelleDevise} -> MGA`, {
          type: 'warning',
          title: 'Taux de change manquant'
        });
        return;
      }

      const ancienneDevise = getCurrentDevise();
      const nouveauTauxChange = taux ? taux.taux : 1.0;

      const nouvellesLignes = formData.lignes.map(ligne => {
        if (ligne.prix_unitaire > 0) {
          const prixEnMGA = convertirVersMGA(ligne.prix_unitaire, ancienneDevise);
          const prixConverti = convertirPrix(prixEnMGA, nouvelleDevise);
          
          return {
            ...ligne,
            prix_unitaire: safeToFixed(prixConverti)
          };
        }
        return ligne;
      });

      setFormData(prev => ({
        ...prev,
        facture: {
          ...prev.facture,
          devise: nouvelleDevise,
          taux_change: nouveauTauxChange
        },
        lignes: nouvellesLignes
      }));

    } catch (error) {
      console.error('Erreur changement devise:', error);
      alert('Erreur lors du changement de devise', {
        type: 'error',
        title: 'Erreur'
      });
    }
  };

  const handleTiersChange = (id_tiers: number) => {
    const selectedTier = tiers.find(t => t.id_tiers === id_tiers);
    
    if (selectedTier && selectedTier.devise_preferee) {
      handleDeviseChange(selectedTier.devise_preferee);
    }
    
    handleFactureChange('id_tiers', id_tiers);
  };

  const handleFactureChange = (field: keyof typeof formData.facture, value: any) => {
    setFormData(prev => ({
      ...prev,
      facture: { ...prev.facture, [field]: value }
    }));
  };

  const handlePaiementFlexibleChange = (field: keyof PaiementFlexibleConfig, value: any) => {
    setPaiementFlexible(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLigneChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newLignes = [...prev.lignes];
      
      if (field === 'code_article' && value) {
        const article = articles.find(a => a.code_article === value);
        if (article) {
          const currentDevise = prev.facture.devise || 'MGA';
          const prixConverti = convertirPrix(article.prix_unitaire, currentDevise);
          
          newLignes[index] = {
            ...newLignes[index],
            code_article: value,
            description: article.description,
            prix_unitaire: safeToFixed(prixConverti),
            taux_tva: article.taux_tva
          };
        }
      } else {
        newLignes[index] = { ...newLignes[index], [field]: value };
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

  const calculateTotals = () => {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    formData.lignes.forEach(ligne => {
      const montantHTSansRemise = ligne.prix_unitaire * ligne.quantite;
      const montantRemise = montantHTSansRemise * (ligne.remise / 100);
      const montantHT = montantHTSansRemise - montantRemise;
      const montantTVA = montantHT * (ligne.taux_tva / 100);
      const montantTTC = montantHT + montantTVA;

      totalHT += montantHT;
      totalTVA += montantTVA;
      totalTTC += montantTTC;
    });

    return { totalHT, totalTVA, totalTTC };
  };

  const calculateLignesAvecMontants = () => {
    return formData.lignes.map(ligne => {
      const montantHTSansRemise = ligne.prix_unitaire * ligne.quantite;
      const montantRemise = montantHTSansRemise * (ligne.remise / 100);
      const montantHT = montantHTSansRemise - montantRemise;
      const montantTVA = montantHT * (ligne.taux_tva / 100);
      const montantTTC = montantHT + montantTVA;

      return {
        ...ligne,
        montant_ht: montantHT,
        montant_tva: montantTVA,
        montant_ttc: montantTTC
      };
    });
  };

  const validerConfigurationPaiement = (): boolean => {
    const { type_paiement, date_finale_paiement, montant_minimum_paiement } = paiementFlexible;

    if (type_paiement === 'flexible') {
      if (!date_finale_paiement) {
        alert('La date finale de paiement est requise pour le paiement flexible', {
          type: 'warning',
          title: 'Configuration incomplète'
        });
        return false;
      }
      if (montant_minimum_paiement <= 0) {
        alert('Le montant minimum de paiement doit être supérieur à 0', {
          type: 'warning',
          title: 'Configuration incomplète'
        });
        return false;
      }
    }

    if (type_paiement === 'acompte') {
      if (paiementFlexible.montant_acompte <= 0) {
        alert('Le montant d\'acompte doit être supérieur à 0', {
          type: 'warning',
          title: 'Configuration incomplète'
        });
        return false;
      }
      if (!paiementFlexible.mode_paiement_acompte) {
        alert('Le mode de paiement de l\'acompte est requis', {
          type: 'warning',
          title: 'Configuration incomplète'
        });
        return false;
      }
    }

    if (type_paiement === 'echeance' && !date_finale_paiement) {
      alert('La date d\'échéance est requise', {
        type: 'warning',
        title: 'Configuration incomplète'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent, statut: 'brouillon' | 'validee' = 'brouillon') => {
    e.preventDefault();
    
    if (!formData.facture.id_tiers || formData.facture.id_tiers === 0) {
      alert('Veuillez sélectionner un client ou fournisseur', {
        type: 'warning',
        title: 'Sélection requise'
      });
      return;
    }

    const lignesValides = formData.lignes.filter(ligne => 
      ligne.code_article && ligne.quantite > 0 && ligne.prix_unitaire >= 0
    );
    
    if (lignesValides.length === 0) {
      alert('Veuillez ajouter au moins un article avec une quantité valide', {
        type: 'warning',
        title: 'Articles manquants'
      });
      return;
    }

    if (formData.facture.total_ttc === 0) {
      alert('Erreur: Le total TTC est à 0. Vérifiez les articles saisis.', {
        type: 'error',
        title: 'Total invalide'
      });
      return;
    }

    // Validation de la configuration du paiement flexible
    if (!validerConfigurationPaiement()) {
      return;
    }

    setSubmitting(true);

    const currentDevise = getCurrentDevise();
    const lignesPourBackend = lignesValides.map(ligne => {
      const prixEnMGA = convertirVersMGA(ligne.prix_unitaire, currentDevise);
      
      return {
        code_article: ligne.code_article,
        description: ligne.description,
        quantite: ligne.quantite,
        prix_unitaire: safeToFixed(prixEnMGA),
        taux_tva: ligne.taux_tva,
        remise: ligne.remise
      };
    });

    const totalHT_MGA = convertirVersMGA(formData.facture.total_ht, currentDevise);
    const totalTVA_MGA = convertirVersMGA(formData.facture.total_tva, currentDevise);
    const totalTTC_MGA = convertirVersMGA(formData.facture.total_ttc, currentDevise);

    // Préparer les données de paiement flexible
    const donneesPaiementFlexible: any = {
      type_paiement: paiementFlexible.type_paiement
    };

    if (paiementFlexible.type_paiement === 'flexible') {
      donneesPaiementFlexible.date_finale_paiement = paiementFlexible.date_finale_paiement;
      donneesPaiementFlexible.montant_minimum_paiement = safeToFixed(
        convertirVersMGA(paiementFlexible.montant_minimum_paiement, currentDevise)
      );
      donneesPaiementFlexible.penalite_retard = paiementFlexible.penalite_retard;
    } else if (paiementFlexible.type_paiement === 'acompte') {
      donneesPaiementFlexible.montant_acompte = safeToFixed(
        convertirVersMGA(paiementFlexible.montant_acompte, currentDevise)
      );
      donneesPaiementFlexible.mode_paiement_acompte = paiementFlexible.mode_paiement_acompte;
    } else if (paiementFlexible.type_paiement === 'echeance') {
      donneesPaiementFlexible.date_finale_paiement = paiementFlexible.date_finale_paiement;
    }

    const payload = {
      date: formData.facture.date,
      type_facture: formData.facture.type_facture,
      id_tiers: formData.facture.id_tiers,
      echeance: formData.facture.echeance,
      reglement: formData.facture.reglement,
      statut: statut,
      devise: currentDevise,
      taux_change: formData.facture.taux_change || 1.0,
      total_ht: safeToFixed(totalHT_MGA),
      total_tva: safeToFixed(totalTVA_MGA),
      total_ttc: safeToFixed(totalTTC_MGA),
      lignes: lignesPourBackend,
      // Ajouter les données de paiement flexible
      ...donneesPaiementFlexible
    };

    console.log('📤 Données envoyées à l\'API (avec paiement flexible):', payload);

    try {
      const nouvelleFacture = await comptabiliteApi.createFacture(payload);
      
      const message = statut === 'validee' 
        ? `Facture ${nouvelleFacture.numero_facture} créée et validée avec succès!`
        : `Facture ${nouvelleFacture.numero_facture} créée en brouillon!`;
      
      alert(message, {
        type: 'success',
        title: 'Succès'
      });
      
      if (statut === 'brouillon') {
        setFactureCreee(nouvelleFacture);
        setShowValidation(true);
      } else {
        resetForm();
      }
    } catch (error: any) {
      console.error('❌ Erreur création facture:', error);
      alert(`Erreur: ${error.message}`, {
        type: 'error',
        title: 'Erreur'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const validerFacture = async (numeroFacture: number) => {
    try {
      setSubmitting(true);
      await comptabiliteApi.validerFacture(numeroFacture);
      alert(`Facture ${numeroFacture} validée avec succès!`, {
        type: 'success',
        title: 'Succès'
      });
      setShowValidation(false);
      setFactureCreee(null);
      resetForm();
    } catch (error: any) {
      console.error('Erreur validation facture:', error);
      alert(`Erreur validation: ${error.message}`, {
        type: 'error',
        title: 'Erreur'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
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
        statut: 'brouillon',
        devise: 'MGA',
        taux_change: 1.0
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
    setPaiementFlexible({
      type_paiement: 'comptant',
      date_finale_paiement: '',
      montant_minimum_paiement: 0,
      penalite_retard: 0,
      montant_acompte: 0,
      mode_paiement_acompte: 'virement'
    });
    setShowValidation(false);
    setFactureCreee(null);
  };

  const getDeviseSymbol = (devise: string) => {
    const symbols: { [key: string]: string } = {
      'MGA': 'Ar',
      'USD': '$',
      'EUR': '€'
    };
    return symbols[devise] || devise;
  };

  const selectedTier = tiers.find(t => t.id_tiers === formData.facture.id_tiers);
  const lignesAvecCalculs = calculateLignesAvecMontants();
  const currentDevise = getCurrentDevise();

  if (loading) {
    return (
      <div className="facture-loading">
        <div className="facture-loading-text">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="facture-form">
      <div className="facture-header">
        <div>
          <h2 className="facture-title">FACTURE</h2>
          <div className="facture-info">
            <div><strong>Date:</strong> {new Date(formData.facture.date).toLocaleDateString('fr-FR')}</div>
            <div><strong>Facture No:</strong> {factureCreee ? factureCreee.numero_facture : 'Nouvelle'}</div>
            <div><strong>Statut:</strong> 
              <span className={`facture-statut ${formData.facture.statut}`}>
                {formData.facture.statut}
              </span>
            </div>
            <div><strong>Total TTC:</strong> 
              <span className="facture-total-ttc">
                {formData.facture.total_ttc.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} {getDeviseSymbol(currentDevise)}
              </span>
            </div>
            <div className="facture-devise-selector">
              <label><strong>Devise:</strong></label>
              <DeviseSelector
                value={currentDevise}
                onChange={handleDeviseChange}
                className="facture-devise-select"
                disabled={showValidation}
              />
              {currentDevise !== 'MGA' && (
                <div className="facture-taux-change">
                  <small>Taux: 1 {currentDevise} = {formData.facture.taux_change || 1.0} MGA</small>
                </div>
              )}
            </div>
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
          <h3 className="facture-section-title">
            {selectedTier?.type_tiers === 'fournisseur' ? 'Fournisseur' : 'Client'}
          </h3>
          <select
            value={formData.facture.id_tiers}
            onChange={(e) => handleTiersChange(parseInt(e.target.value))}
            className="facture-client-select"
            required
            disabled={showValidation}
          >
            <option value={0}>Sélectionner un client/fournisseur</option>
            {tiers.map(tier => (
              <option key={tier.id_tiers} value={tier.id_tiers}>
                {tier.type_tiers === 'fournisseur' ? '🚚 ' : '👤 '}
                {tier.nom} - {tier.numero} 
                {tier.devise_preferee && ` (${tier.devise_preferee})`}
              </option>
            ))}
          </select>
          
          {selectedTier && (
            <div className="facture-client-details">
              <div><strong>Type:</strong> {selectedTier.type_tiers}</div>
              <div><strong>Nom:</strong> {selectedTier.nom}</div>
              <div><strong>Adresse:</strong> {selectedTier.adresse}</div>
              <div><strong>Tel:</strong> {selectedTier.telephone}</div>
              <div><strong>Email:</strong> {selectedTier.email}</div>
              {selectedTier.devise_preferee && (
                <div><strong>Devise préférée:</strong> {selectedTier.devise_preferee}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section Configuration Paiement Flexible */}
      <div className="facture-paiement-section">
        <h3 className="facture-section-title">Configuration du Paiement</h3>
        <div className="facture-paiement-grid">
          <div className="facture-field">
            <label className="facture-label">Type de paiement</label>
            <select
              value={paiementFlexible.type_paiement}
              onChange={(e) => handlePaiementFlexibleChange('type_paiement', e.target.value)}
              className="facture-select"
              disabled={showValidation}
            >
              <option value="comptant">💳 Paiement comptant (immédiat)</option>
              <option value="flexible">🔄 Paiement flexible (échelonné)</option>
              <option value="acompte">💰 Acompte (partiel + solde)</option>
              <option value="echeance">📅 Échéance (paiement unique)</option>
            </select>
          </div>

          {/* Configuration pour paiement flexible */}
          {paiementFlexible.type_paiement === 'flexible' && (
            <>
              <div className="facture-field">
                <label className="facture-label">Date finale de paiement</label>
                <input
                  type="date"
                  value={paiementFlexible.date_finale_paiement}
                  onChange={(e) => handlePaiementFlexibleChange('date_finale_paiement', e.target.value)}
                  className="facture-input"
                  disabled={showValidation}
                  min={formData.facture.date}
                />
              </div>
              <div className="facture-field">
                <label className="facture-label">Montant minimum par paiement ({currentDevise})</label>
                <input
                  type="number"
                  value={paiementFlexible.montant_minimum_paiement}
                  onChange={(e) => handlePaiementFlexibleChange('montant_minimum_paiement', Number(e.target.value))}
                  className="facture-input"
                  disabled={showValidation}
                  min="0"
                  step="1000"
                />
              </div>
              <div className="facture-field">
                <label className="facture-label">Pénalité de retard (%)</label>
                <input
                  type="number"
                  value={paiementFlexible.penalite_retard}
                  onChange={(e) => handlePaiementFlexibleChange('penalite_retard', Number(e.target.value))}
                  className="facture-input"
                  disabled={showValidation}
                  min="0"
                  max="20"
                  step="0.5"
                />
              </div>
            </>
          )}

          {/* Configuration pour acompte */}
          {paiementFlexible.type_paiement === 'acompte' && (
            <>
              <div className="facture-field">
                <label className="facture-label">Montant d'acompte ({currentDevise})</label>
                <input
                  type="number"
                  value={paiementFlexible.montant_acompte}
                  onChange={(e) => handlePaiementFlexibleChange('montant_acompte', Number(e.target.value))}
                  className="facture-input"
                  disabled={showValidation}
                  min="0"
                  max={formData.facture.total_ttc}
                  step="1000"
                />
                <small className="facture-help-text">
                  {paiementFlexible.montant_acompte > 0 && (
                    <>Soit {((paiementFlexible.montant_acompte / formData.facture.total_ttc) * 100).toFixed(1)}% du total</>
                  )}
                </small>
              </div>
              <div className="facture-field">
                <label className="facture-label">Mode de paiement acompte</label>
                <select
                  value={paiementFlexible.mode_paiement_acompte}
                  onChange={(e) => handlePaiementFlexibleChange('mode_paiement_acompte', e.target.value)}
                  className="facture-select"
                  disabled={showValidation}
                >
                  <option value="virement">Virement</option>
                  <option value="cheque">Chèque</option>
                  <option value="espece">Espèce</option>
                  <option value="carte">Carte</option>
                </select>
              </div>
            </>
          )}

          {/* Configuration pour échéance */}
          {paiementFlexible.type_paiement === 'echeance' && (
            <div className="facture-field">
              <label className="facture-label">Date d'échéance</label>
              <input
                type="date"
                value={paiementFlexible.date_finale_paiement}
                onChange={(e) => handlePaiementFlexibleChange('date_finale_paiement', e.target.value)}
                className="facture-input"
                disabled={showValidation}
                min={formData.facture.date}
              />
            </div>
          )}
        </div>

        {/* Résumé du type de paiement */}
        <div className="facture-paiement-resume">
          <div className={`facture-paiement-badge facture-paiement-${paiementFlexible.type_paiement}`}>
            {paiementFlexible.type_paiement === 'comptant' && '💳 Paiement immédiat à la validation'}
            {paiementFlexible.type_paiement === 'flexible' && '🔄 Paiements échelonnés acceptés'}
            {paiementFlexible.type_paiement === 'acompte' && `💰 Acompte de ${paiementFlexible.montant_acompte} ${currentDevise}`}
            {paiementFlexible.type_paiement === 'echeance' && '📅 Paiement unique à échéance'}
          </div>
        </div>
      </div>

      <div className="facture-details">
        <div className="facture-field">
          <label className="facture-label">Devise</label>
          <DeviseSelector
            value={currentDevise}
            onChange={handleDeviseChange}
            className="facture-select"
            disabled={showValidation}
          />
        </div>
        
        <div className="facture-field">
          <label className="facture-label">Type de document</label>
          <select
            value={formData.facture.type_facture}
            onChange={(e) => handleFactureChange('type_facture', e.target.value)}
            className="facture-select"
            disabled={showValidation}
          >
            <option value="facture">Facture</option>
            <option value="proforma">Proforma</option>
            <option value="avoir">Avoir</option>
          </select>
        </div>
        
        <div className="facture-field">
          <label className="facture-label">Mode de règlement</label>
          <select
            value={formData.facture.reglement}
            onChange={(e) => handleFactureChange('reglement', e.target.value)}
            className="facture-select"
            disabled={showValidation}
          >
            <option value="virement">Virement</option>
            <option value="cheque">Chèque</option>
            <option value="espece">Espèce</option>
            <option value="carte">Carte</option>
          </select>
        </div>
        
        <div className="facture-field">
          <label className="facture-label">Date d'échéance</label>
          <input
            type="date"
            value={formData.facture.echeance}
            onChange={(e) => handleFactureChange('echeance', e.target.value)}
            className="facture-input"
            disabled={showValidation}
          />
        </div>
      </div>

      <div className="facture-articles-section">
        <div className="facture-articles-header">
          <h3 className="facture-articles-title">Articles et Services</h3>
          {!showValidation && (
            <button
              type="button"
              onClick={addLigne}
              className="facture-add-button"
            >
              + Ajouter une ligne
            </button>
          )}
        </div>

        <div className="facture-table-container">
          <table className="facture-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Libellé</th>
                <th>PU ({currentDevise})</th>
                <th>Quantité</th>
                <th>Remise %</th>
                <th>Montant HT ({currentDevise})</th>
                <th>TVA %</th>
                {!showValidation && <th>Actions</th>}
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
                  showRemove={formData.lignes.length > 1 && !showValidation}
                  disabled={showValidation}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CalculsFacture 
        totalHT={formData.facture.total_ht}
        totalTVA={formData.facture.total_tva}
        totalTTC={formData.facture.total_ttc}
        echeance={formData.facture.echeance}
        reglement={formData.facture.reglement}
        devise={currentDevise}
        taux_change={formData.facture.taux_change || 1.0}
      />

      {/* Section pour les informations de paiement flexible */}
      <div className="facture-paiement-resume-section">
        <h3 className="facture-section-title">Configuration du Paiement</h3>
        <div className={`facture-paiement-badge facture-paiement-${paiementFlexible.type_paiement}`}>
          {paiementFlexible.type_paiement === 'comptant' && '💳 Paiement immédiat à la validation'}
          {paiementFlexible.type_paiement === 'flexible' && `🔄 Paiements échelonnés jusqu'au ${new Date(paiementFlexible.date_finale_paiement).toLocaleDateString('fr-FR')}`}
          {paiementFlexible.type_paiement === 'acompte' && `💰 Acompte de ${paiementFlexible.montant_acompte.toLocaleString('fr-FR')} ${currentDevise} requis`}
          {paiementFlexible.type_paiement === 'echeance' && `📅 Paiement unique le ${new Date(paiementFlexible.date_finale_paiement).toLocaleDateString('fr-FR')}`}
        </div>
        
        {paiementFlexible.type_paiement === 'acompte' && paiementFlexible.montant_acompte > 0 && formData.facture.total_ttc > 0 && (
          <div className="facture-acompte-details">
            <small>
              Solde à payer: {(formData.facture.total_ttc - paiementFlexible.montant_acompte).toLocaleString('fr-FR')} {currentDevise}
              ({(((formData.facture.total_ttc - paiementFlexible.montant_acompte) / formData.facture.total_ttc) * 100).toFixed(1)}% du total)
            </small>
          </div>
        )}
      </div>

      <div className="facture-actions">
        {!showValidation ? (
          <>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'brouillon')}
              disabled={submitting}
              className="facture-draft-button"
            >
              {submitting ? 'Création en cours...' : 'Enregistrer Brouillon'}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'validee')}
              disabled={submitting}
              className="facture-submit-button"
            >
              {submitting ? 'Création en cours...' : 'Créer et Valider la Facture'}
            </button>
          </>
        ) : (
          <div className="facture-validation-actions">
            <p>Facture <strong>{factureCreee?.numero_facture}</strong> créée en brouillon</p>
            <div className="facture-validation-buttons">
              <button
                type="button"
                onClick={() => factureCreee && validerFacture(factureCreee.numero_facture!)}
                disabled={submitting}
                className="facture-validate-button"
              >
                {submitting ? 'Validation...' : '✅ Valider cette Facture'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="facture-new-button"
              >
                📝 Nouvelle Facture
              </button>
            </div>
          </div>
        )}
      </div>

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

export default FactureForm;