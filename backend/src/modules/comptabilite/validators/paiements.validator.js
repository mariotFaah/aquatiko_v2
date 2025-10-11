// src/modules/comptabilite/validators/paiements.validator.js
export const createPaiementValidator = {
  numero_facture: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'Le numéro de facture est requis'
  },
  montant: {
    in: ['body'],
    isFloat: { min: 0.01 },
    errorMessage: 'Le montant doit être un nombre positif'
  },
  mode_paiement: {
    in: ['body'],
    isIn: [['espèce', 'virement', 'chèque', 'carte']],
    errorMessage: 'Mode de paiement invalide'
  },
  date_paiement: {
    in: ['body'],
    isDate: true,
    errorMessage: 'Date de paiement invalide'
  }
};