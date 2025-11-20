// src/core/auth/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ RENOMMER pour éviter la confusion

  const { login, isAuthenticated, isLoading } = useAuth(); // ✅ MAINTENANT isLoading existe
  const navigate = useNavigate();
  const location = useLocation();

  // Redirection si déjà authentifié
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true); // ✅ UTILISER isSubmitting

    try {
      await login({ email, password });
      // La redirection se fera automatiquement via l'useEffect
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher le loading pendant la vérification initiale
  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-loading">
          <div className="spinner"></div>
          <p>Vérification de la session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/vite.svg" alt="Aquatiko Logo" className="login-logo" />
          <h1>Aquatiko</h1>
          <p className="login-subtitle">Système de gestion d'entreprise</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={isSubmitting} // ✅ UTILISER isSubmitting
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              disabled={isSubmitting} // ✅ UTILISER isSubmitting
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isSubmitting} // ✅ UTILISER isSubmitting
          >
            {isSubmitting ? ( // ✅ UTILISER isSubmitting
              <>
                <div className="button-spinner"></div>
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="login-demo">
          <h3>Comptes de démonstration :</h3>
          <div className="demo-accounts">
            <div className="demo-account">
              <strong>Admin</strong>
              <div>admin@aquatiko.mg</div>
              <div>password123</div>
            </div>
            <div className="demo-account">
              <strong>Comptable</strong>
              <div>comptable@aquatiko.mg</div>
              <div>password123</div>
            </div>
            <div className="demo-account">
              <strong>Commercial</strong>
              <div>commercial@aquatiko.mg</div>
              <div>password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;