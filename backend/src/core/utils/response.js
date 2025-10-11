// src/core/utils/response.js

// Export nommés pour les anciens contrôleurs
export function successResponse(res, data = null, message = 'Succès', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function errorResponse(res, message = 'Erreur interne du serveur', statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null
  });
}

export function createdResponse(res, data = null, message = 'Créé avec succès') {
  return res.status(201).json({
    success: true,
    message,
    data
  });
}

export function notFoundResponse(res, message = 'Ressource non trouvée') {
  return res.status(404).json({
    success: false,
    message,
    data: null
  });
}

export function validationErrorResponse(res, errors, message = 'Erreur de validation') {
  return res.status(422).json({
    success: false,
    message,
    errors
  });
}

// Classe Response pour les nouveaux contrôleurs
export class Response {
  static success(res, data = null, message = 'Succès') {
    return successResponse(res, data, message, 200);
  }

  static created(res, data = null, message = 'Créé avec succès') {
    return createdResponse(res, data, message);
  }

  static error(res, message = 'Erreur interne du serveur', statusCode = 500) {
    return errorResponse(res, message, statusCode);
  }

  static notFound(res, message = 'Ressource non trouvée') {
    return notFoundResponse(res, message);
  }

  static validationError(res, errors, message = 'Erreur de validation') {
    return validationErrorResponse(res, errors, message);
  }

  static unauthorized(res, message = 'Non autorisé') {
    return errorResponse(res, message, 401);
  }

  static forbidden(res, message = 'Accès refusé') {
    return errorResponse(res, message, 403);
  }
}

// Export par défaut
export default Response;