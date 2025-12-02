import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de connexion
    console.log('Connexion avec:', { email, password, rememberMe });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Section Image/Informations de l'entreprise */}
        <div className="login-info-section">
          <div className="company-brand">
            <h1 className="company-name">OMNISERVE EXPERTS</h1>
            <p className="company-tagline">Votre partenaire en import-export</p>
          </div>
          
          <div className="company-info-card">
            <h3>À propos d'OMNISERVE EXPERTS</h3>
            <div className="company-details">
              <p><strong>NIF :</strong> 4011537252</p>
              <p><strong>STAT :</strong> 46309 31 2024 0 00169</p>
              <p><strong>Téléphone :</strong> +261 32 77 531 69</p>
              <p><strong>Adresse :</strong> Ambodisaina Ivondro, Tamatave, Madagascar</p>
              <p><strong>Email :</strong> contact@omniserve.experts</p>
            </div>
            <div className="company-values">
              <h4>Nos valeurs</h4>
              <ul>
                <li>Professionnalisme et rigueur</li>
                <li>Fiabilité et transparence</li>
                <li>Adaptabilité aux besoins clients</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section Formulaire */}
        <div className="login-form-section">
          <div className="login-container">
            <div className="login-header">
              <div className="logo-container">
                <div className="logo-icon">OE</div>
                <div className="logo-text">
                  <h2 className="login-title">Aquatiko</h2>
                  <p className="login-subtitle">Plateforme de gestion</p>
                </div>
              </div>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="label-icon">📧</span>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span className="label-icon">🔒</span>
                  Mot de passe
                </label>
                <div className="password-input-container">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                    title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
                  Mot de passe oublié ?
                </a>
              </div>

              <button type="submit" className="login-button">
                <span>Se connecter</span>
              </button>

              <div className="login-footer">
                <p className="version-info">Version 2.0 © 2024 OMNISERVE EXPERTS</p>
                <p className="security-info">
                  <span className="security-icon">🛡️</span>
                  Connexion sécurisée
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;