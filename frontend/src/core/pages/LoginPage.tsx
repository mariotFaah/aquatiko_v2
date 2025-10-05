import React from 'react';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2 className="login-title">
            Connexion Aquatiko
          </h2>
        </div>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="Mot de passe"
            />
          </div>
          <div>
            <button
              type="submit"
              className="login-button"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;