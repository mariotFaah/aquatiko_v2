// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Database
import { testConnection } from './core/database/connection.js';

// Routes des modules
import comptabiliteRoutes from './modules/comptabilite/routes/index.js';
import importExportRoutes from './modules/import-export/routes/index.js';
import initCRMModule from './modules/crm/index.js'; 
import { initAuthModule } from './modules/auth/index.js';


import { auth } from './core/middleware/auth.js';

dotenv.config();

const app = express();

// Middleware CORS corrigé - Autorise toutes les origines
app.use(helmet());
app.use(cors({
  origin: true,  // Autorise toutes les origines
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Routes de santé
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStatus ? 'Connected' : 'Disconnected',
    modules: ['comptabilite', 'import-export', 'crm', 'auth']  // ✅ Retiré user-management
  });
});



initAuthModule(app);

// ✅ ROUTE TEMPORAIRE POUR TESTER LA GESTION UTILISATEURS
app.get('/api/auth/users-test', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Accès réservé aux administrateurs' 
    });
  }
  
  // Données temporaires pour tester
  res.json({
    success: true,
    message: 'Liste des utilisateurs (test)',
    data: [
      { 
        id: 15, 
        email: 'admin@aquatiko.mg', 
        nom: 'Admin', 
        prenom: 'Principal',
        role: 'admin',
        is_active: true,
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      { 
        id: 16, 
        email: 'comptable@aquatiko.mg', 
        nom: 'Comptable', 
        prenom: 'Marie',
        role: 'comptable', 
        is_active: true,
        last_login: null,
        created_at: new Date().toISOString()
      }
    ]
  });
});

// ✅ ROUTES PROTÉGÉES PAR AUTH
app.use('/api/comptabilite', auth, comptabiliteRoutes);
app.use('/api/import-export', auth, importExportRoutes);

// ✅ INITIALISATION DU MODULE CRM (avec auth intégré)
initCRMModule(app);

// Route 404 avec un chemin explicite
app.use('/:any*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📊 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Modules activés: Comptabilité, Import/Export, CRM, Auth`); // ✅ Retiré User Management
  console.log(`🔐 API Auth disponible: http://localhost:${PORT}/api/auth`);
  
  // Tester la connexion DB
  await testConnection();
});