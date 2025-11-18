// backend/src/modules/auth/index.js
module.exports = {
  routes: require('./routes/auth.routes'),
  middleware: require('./middleware/authMiddleware')
};