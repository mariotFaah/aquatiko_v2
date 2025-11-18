// backend/src/modules/auth/controllers/AuthController.js
import AuthService from '../services/AuthService.js';

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validation basique
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe sont requis'
        });
      }

      const result = await this.authService.login(email, password);

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: result
      });

    } catch (error) {
      console.error('Erreur AuthController.login:', error);
      
      res.status(401).json({
        success: false,
        message: error.message || 'Erreur de connexion'
      });
    }
  };

  me = async (req, res) => {
    try {
      // L'utilisateur est attaché à req par le middleware d'authentification
      const { password_hash, ...userWithoutPassword } = req.user;

      res.json({
        success: true,
        data: {
          user: userWithoutPassword
        }
      });

    } catch (error) {
      console.error('Erreur AuthController.me:', error);
      
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil'
      });
    }
  };

  validateToken = async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token requis'
        });
      }

      const result = await this.authService.validateToken(token);

      if (!result.valid) {
        return res.status(401).json({
          success: false,
          valid: false,
          message: result.error
        });
      }

      res.json({
        success: true,
        valid: true,
        data: {
          user: result.user
        }
      });

    } catch (error) {
      console.error('Erreur AuthController.validateToken:', error);
      
      res.status(500).json({
        success: false,
        message: 'Erreur de validation du token'
      });
    }
  };
}

export default AuthController;