// backend/src/modules/auth/services/AuthService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_super_securise';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email, password) {
    try {
      // Trouver l'utilisateur par email
      const user = await this.userRepository.findByEmail(email);
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Mettre à jour la dernière connexion
      await this.userRepository.updateLastLogin(user.id_user);

      // Générer le token JWT
      const token = jwt.sign(
        { 
          userId: user.id_user,
          email: user.email,
          role: user.code_role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Retourner les infos utilisateur (sans le password_hash)
      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token,
        expiresIn: JWT_EXPIRES_IN
      };

    } catch (error) {
      console.error('Erreur AuthService.login:', error);
      throw error;
    }
  }

  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await this.userRepository.findByIdWithRole(decoded.userId);
      
      if (!user || !user.is_active) {
        throw new Error('Utilisateur non trouvé ou inactif');
      }

      return {
        valid: true,
        user: {
          id_user: user.id_user,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          code_role: user.code_role,
          nom_role: user.nom_role
        }
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

export default AuthService;