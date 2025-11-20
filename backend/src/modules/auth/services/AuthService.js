import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../../core/database/connection.js';

export class AuthService {
  async login(email, password) {
    const user = await db('users')
      .where({ email, actif: true })
      .first();

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = jwt.sign(
      { 
        userId: user.id_user, 
        email: user.email, 
        role: user.role,
        nom: user.nom 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { 
      user: { 
        id: user.id_user,
        email: user.email,
        nom: user.nom,
        role: user.role
      }, 
      token 
    };
  }
}