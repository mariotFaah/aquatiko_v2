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

// Module d'authentification seulement
import authRoutes from './modules/auth/routes/auth.routes.js';

// ✅ NOUVEAU : Middleware d'authentification simple
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

// ✅ ROUTE AUTH (publique)
app.use('/api/auth', authRoutes);

// ✅ ROUTE SIMPLE POUR GESTION UTILISATEURS (admin seulement)
app.get('/api/admin/users', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  res.json({ 
    message: 'Gestion des utilisateurs - Endpoint à implémenter',
    users: [
      { id: 1, email: 'admin@aquatiko.mg', role: 'admin' },
      { id: 2, email: 'comptable@aquatiko.mg', role: 'comptable' },
      { id: 3, email: 'commercial@aquatiko.mg', role: 'commercial' }
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