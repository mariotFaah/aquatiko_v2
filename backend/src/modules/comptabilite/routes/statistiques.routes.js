// src/modules/comptabilite/routes/statistiques.routes.js
import express from 'express';
import { StatistiqueController } from '../controllers/StatistiqueController.js';

const router = express.Router();
const statistiqueController = new StatistiqueController();

// GET /api/comptabilite/stats/chiffre-affaire - Chiffre d'affaire par période
router.get('/chiffre-affaire', statistiqueController.getChiffreAffaire.bind(statistiqueController));

// GET /api/comptabilite/stats/top-clients - Top clients
router.get('/top-clients', statistiqueController.getTopClients.bind(statistiqueController));

// GET /api/comptabilite/stats/top-produits - Top produits
router.get('/top-produits', statistiqueController.getTopProduits.bind(statistiqueController));

// GET /api/comptabilite/stats/indicateurs - Indicateurs généraux
router.get('/indicateurs', statistiqueController.getIndicateurs.bind(statistiqueController));

export default router;