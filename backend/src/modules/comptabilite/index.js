import comptabiliteRoutes from './routes/index.js';

export { default as comptabiliteRoutes } from './routes/index.js';

// Export des services pour les autres modules
export { FacturationService } from './services/FacturationService.js';
export { CalculService } from './services/CalculService.js';

export default {
  routes: comptabiliteRoutes,
  name: 'comptabilite'
};