// backend/src/modules/auth/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js'; // ✅ Changement ici

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_super_securise';

class AuthMiddleware {
  constructor() {
    this.userRepository = new UserRepository(); // ✅ Maintenant ça fonctionne
  }

  authenticate = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Token d\'authentification manquant'
        });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const user = await this.userRepository.findByIdWithRole(decoded.userId);
      
      if (!user || !user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé ou inactif'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Erreur authentification:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token invalide'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expiré'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erreur d\'authentification'
      });
    }
  };

  requireRole = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }

      if (!allowedRoles.includes(req.user.code_role)) {
        return res.status(403).json({
          success: false,
          message: 'Permissions insuffisantes'
        });
      }

      next();
    };
  };

  requirePermission = (module, action) => {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Authentification requise'
          });
        }

        const hasPermission = await this.userRepository.hasPermission(
          req.user.id_user, 
          module, 
          action
        );

        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: `Permission ${action} requise pour le module ${module}`
          });
        }

        next();
      } catch (error) {
        console.error('Erreur vérification permission:', error);
        return res.status(500).json({
          success: false,
          message: 'Erreur de vérification des permissions'
        });
      }
    };
  };
}

export default new AuthMiddleware();