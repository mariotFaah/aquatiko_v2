// src/modules/crm/pages/CRMPage.tsx
import React from 'react';
import './CRMPage.css';

const CRMPage: React.FC = () => {
  return (
    <div className="crm-container">
      <div className="crm-header">
        <h1 className="crm-title">Module CRM</h1>
        <p className="crm-subtitle">
          Gestion de la relation client
        </p>
      </div>
    </div>
  );
};

export default CRMPage;