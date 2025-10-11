import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Database
import { testConnection } from './core/database/connection.js';

// Routes des modules
import comptabiliteRoutes from './modules/comptabilite/routes/index.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // URL exacte de votre frontend Vite
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
    modules: ['comptabilite'] 
  });
});

// Routes des modules
app.use('/api/comptabilite', comptabiliteRoutes);

// ✅ CORRECTION EXPRESS 5 : Route 404 avec un chemin explicite
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
  
  // Tester la connexion DB
  await testConnection();
});