// src/modules/comptabilite/components/DeviseSelector/DeviseSelector.tsx
import React from 'react';
import { deviseApi } from '../../services/deviseApi';
import './DeviseSelector.css';

interface DeviseSelectorProps {
  value: string;
  onChange: (devise: string) => void;
  className?: string;
  disabled?: boolean; // AJOUTER CETTE PROP
}

export const DeviseSelector: React.FC<DeviseSelectorProps> = ({ 
  value, 
  onChange, 
  className = '',
  disabled = false // VALEUR PAR DÉFAUT
}) => {
  const [devises, setDevises] = React.useState<string[]>(['MGA', 'USD', 'EUR']);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadDevises = async () => {
      setLoading(true);
      try {
        const devisesDisponibles = await deviseApi.getDevisesDisponibles();
        setDevises(devisesDisponibles);
      } catch (error) {
        console.error('Erreur chargement devises:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDevises();
  }, []);

  const getDeviseSymbol = (devise: string) => {
    const symbols: { [key: string]: string } = {
      'MGA': 'Ar',
      'USD': '$',
      'EUR': '€'
    };
    return symbols[devise] || devise;
  };

  if (loading) {
    return <div className={`devise-selector loading ${className}`}>Chargement...</div>;
  }

  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className={`devise-selector ${className}`}
      disabled={disabled} // AJOUTER L'ATTRIBUT DISABLED
    >
      {devises.map(devise => (
        <option key={devise} value={devise}>
          {devise} ({getDeviseSymbol(devise)})
        </option>
      ))}
    </select>
  );
};

export default DeviseSelector;