/**
 * Utilitaires de réponse standardisés
 */

// Nouvelles fonctions (pour Import/Export)
export const sendSuccess = (res, data, message = 'Succès', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const sendError = (res, statusCode, message = 'Erreur', error = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error;
  }

  res.status(statusCode).json(response);
};

// Anciennes fonctions (pour Comptabilité)
export const successResponse = (res, data, message = 'Succès') => {
  res.status(200).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const createdResponse = (res, data, message = 'Créé avec succès') => {
  res.status(201).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const errorResponse = (res, message = 'Erreur', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error;
  }

  res.status(statusCode).json(response);
};

// Alias pour compatibilité
export const notFoundResponse = (res, message = 'Non trouvé') => {
  errorResponse(res, message, 404);
};

export const badRequestResponse = (res, message = 'Requête invalide') => {
  errorResponse(res, message, 400);
};

// Export pour DeviseController
export const Response = {
  sendSuccess,
  sendError,
  successResponse,
  createdResponse,
  errorResponse,
  notFoundResponse,
  badRequestResponse
};

export default {
  sendSuccess,
  sendError,
  successResponse,
  createdResponse,
  errorResponse,
  notFoundResponse,
  badRequestResponse,
  Response
};
