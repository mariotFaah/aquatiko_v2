import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { importExportApi } from '../services/api';
import type { Commande } from '../types';
import './ExpeditionsListPage.css';

const ExpeditionsListPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [filters, setFilters] = useState({
    statut: '',
    type: '',
    transporteur: ''
  });

  useEffect(() => {
    loadCommandes();
  }, []);

  const loadCommandes = async () => {
    try {
      console.log('🔄 Chargement des commandes depuis ExpeditionsListPage...');
      const data = await importExportApi.getCommandes();
      console.log('📦 Commandes chargées:', data.length);
      
      // Debug détaillé
      data.forEach((commande, index) => {
        console.log(`Commande ${index + 1}:`, {
          id: commande.id,
          numero: commande.numero_commande,
          hasExpedition: !!commande.expedition,
          expedition: commande.expedition
        });
      });
      
      const avecExpeditions = data.filter(c => c.expedition);
      console.log('🚚 Commandes avec expédition:', avecExpeditions.length);
      
      setCommandes(data);
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    const colors = {
      preparation: 'warning',
      'expédiée': 'info',
      transit: 'primary',
      arrivée: 'success',
      livrée: 'completed'
    };
    return colors[statut as keyof typeof colors] || 'default';
  };

  const getStatutText = (statut: string) => {
    const texts = {
      preparation: 'En préparation',
      'expédiée': 'Expédiée',
      transit: 'En transit',
      arrivée: 'Arrivée',
      livrée: 'Livrée'
    };
    return texts[statut as keyof typeof texts] || statut;
  };

  // Commandes avec expédition
  const expeditionsAvecExpédition = commandes.filter(c => c.expedition);
  const commandesSansExpedition = commandes.filter(c => !c.expedition);

  const filteredExpeditions = expeditionsAvecExpédition.filter(commande => {
    if (filters.statut && commande.expedition?.statut !== filters.statut) return false;
    if (filters.type && commande.type !== filters.type) return false;
    if (filters.transporteur && 
        !commande.expedition?.transporteur?.toLowerCase().includes(filters.transporteur.toLowerCase())) 
      return false;
    return true;
  });

  console.log('📊 États actuels:', {
    totalCommandes: commandes.length,
    avecExpedition: expeditionsAvecExpédition.length,
    sansExpedition: commandesSansExpedition.length,
    filtered: filteredExpeditions.length,
    filters: filters
  });

  if (loading) {
    return (
      <div className="expeditions-container">
        <div className="loading-spinner"></div>
        <p style={{textAlign: 'center', color: '#666'}}>Chargement des expéditions...</p>
      </div>
    );
  }

  return (
    <div className="expeditions-container">
      <div className="page-header">
        <div className="header-left">
          <h1>Gestion des Expéditions</h1>
          <p>Suivi logistique des commandes import/export</p>
        </div>
        <div className="header-actions">
          <button onClick={loadCommandes} className="btn-secondary" title="Rafraîchir">
            🔄 Actualiser
          </button>
          <Link to="/import-export/commandes" className="btn-secondary">
            📋 Voir les commandes
          </Link>
        </div>
      </div>

      {/* Alert pour commandes sans expédition */}
      {commandesSansExpedition.length > 0 && (
        <div className="alert-info">
          <div className="alert-icon">💡</div>
          <div className="alert-content">
            <strong>{commandesSansExpedition.length} commande(s) sans expédition</strong>
            <p>Créez des expéditions pour suivre la logistique de ces commandes.</p>
          </div>
          <Link to="/import-export/commandes" className="btn-alert">
            Voir les commandes
          </Link>
        </div>
      )}

      {/* Filtres */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Statut</label>
          <select 
            value={filters.statut} 
            onChange={(e) => setFilters(prev => ({ ...prev, statut: e.target.value }))}
          >
            <option value="">Tous les statuts</option>
            <option value="preparation">En préparation</option>
            <option value="expédiée">Expédiée</option>
            <option value="transit">En transit</option>
            <option value="arrivée">Arrivée</option>
            <option value="livrée">Livrée</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select 
            value={filters.type} 
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">Tous les types</option>
            <option value="import">Import</option>
            <option value="export">Export</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Transporteur</label>
          <input 
            type="text" 
            placeholder="Rechercher un transporteur..."
            value={filters.transporteur}
            onChange={(e) => setFilters(prev => ({ ...prev, transporteur: e.target.value }))}
          />
        </div>

        {/* Reset filters */}
        {(filters.statut || filters.type || filters.transporteur) && (
          <div className="filter-group">
            <label>&nbsp;</label>
            <button 
              onClick={() => setFilters({statut: '', type: '', transporteur: ''})}
              className="btn-reset"
            >
              ❌ Reset
            </button>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-number">{expeditionsAvecExpédition.length}</div>
            <div className="stat-label">Expéditions actives</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-number">{commandesSansExpedition.length}</div>
            <div className="stat-label">Sans expédition</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <div className="stat-number">
              {expeditionsAvecExpédition.filter(c => c.expedition?.statut === 'preparation').length}
            </div>
            <div className="stat-label">En préparation</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">
              {expeditionsAvecExpédition.filter(c => c.expedition?.statut === 'livrée').length}
            </div>
            <div className="stat-label">Livrées</div>
          </div>
        </div>
      </div>

      {/* Liste des expéditions */}
      <div className="expeditions-list">
        <div className="table-header">
          <div className="col-commande">Commande</div>
          <div className="col-client">Client</div>
          <div className="col-transport">Transporteur</div>
          <div className="col-dates">Dates</div>
          <div className="col-statut">Statut</div>
          <div className="col-actions">Actions</div>
        </div>

        {filteredExpeditions.length === 0 ? (
          <div className="empty-state">
            {expeditionsAvecExpédition.length === 0 ? (
              <>
                <div className="empty-icon">🚚</div>
                <h3>Aucune expédition créée</h3>
                <p>
                  Commencez par créer des expéditions pour vos commandes existantes.
                  <br />
                  <strong>Conseil:</strong> Allez dans une commande et cliquez sur "🚚 Gérer l'expédition"
                  <br />
                  <Link to="/import-export/commandes" className="btn-primary" style={{marginTop: '16px', display: 'inline-block'}}>
                    📋 Voir les commandes
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className="empty-icon">🔍</div>
                <h3>Aucune expédition trouvée</h3>
                <p>Aucune expédition ne correspond à vos critères de recherche.</p>
                <button 
                  onClick={() => setFilters({statut: '', type: '', transporteur: ''})}
                  className="btn-primary"
                  style={{marginTop: '16px'}}
                >
                  🔄 Réinitialiser les filtres
                </button>
              </>
            )}
          </div>
        ) : (
          filteredExpeditions.map(commande => (
            <div key={commande.id} className="expedition-item">
              <div className="col-commande">
                <div className="commande-ref">{commande.numero_commande}</div>
                <div className="commande-type">{commande.type === 'import' ? '📥 Import' : '📤 Export'}</div>
              </div>

              <div className="col-client">
                <div className="client-name">{commande.client?.nom}</div>
                <div className="client-email">{commande.client?.email}</div>
              </div>

              <div className="col-transport">
                <div className="transporteur">{commande.expedition?.transporteur || 'Non spécifié'}</div>
                <div className="mode-transport">{commande.expedition?.mode_transport || '-'}</div>
              </div>

              <div className="col-dates">
                <div className="date-expedition">
                  <strong>Expédition:</strong>{' '}
                  {commande.expedition?.date_expedition 
                    ? new Date(commande.expedition.date_expedition).toLocaleDateString('fr-FR')
                    : 'Non planifiée'
                  }
                </div>
                <div className="date-arrivee">
                  <strong>Arrivée prévue:</strong>{' '}
                  {commande.expedition?.date_arrivee_prevue 
                    ? new Date(commande.expedition.date_arrivee_prevue).toLocaleDateString('fr-FR')
                    : '-'
                  }
                </div>
              </div>

              <div className="col-statut">
                <span className={`statut-badge statut-${getStatutColor(commande.expedition?.statut || '')}`}>
                  {getStatutText(commande.expedition?.statut || '')}
                </span>
              </div>

              <div className="col-actions">
                <Link 
                  to={`/import-export/commandes/${commande.id}`}
                  className="btn-action"
                  title="Voir détails"
                >
                  👁️
                </Link>
                <Link 
                  to={`/import-export/commandes/${commande.id}/expedition`}
                  className="btn-action"
                  title="Modifier expédition"
                >
                  ✏️
                </Link>
                {commande.expedition?.numero_bl && (
                  <button className="btn-action" title="Télécharger BL">
                    📄
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpeditionsListPage;
