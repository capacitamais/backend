const checkRole = (requiredRole) => {
    return (req, res, next) => {
      if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
      }
      next();
    };
  };
  
  module.exports = checkRole;
  