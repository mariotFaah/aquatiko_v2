export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // 👈 Important : collecte toutes les erreurs
      stripUnknown: true // 👈 Supprime les champs non définis dans le schema
    });
    
    if (error) {
      console.log('❌ Erreur validation:', error.details);
      
      return res.status(400).json({
        success: false,
        message: error.details.map(detail => detail.message).join(', '), // 👈 Format attendu par le frontend
        errors: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }
    next();
  };
};