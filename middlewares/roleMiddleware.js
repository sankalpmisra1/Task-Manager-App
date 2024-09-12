const roles = require('../config/roles');

const roleMiddleware = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.roles[0])) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };
  const checkRole = (requiredRoles) => {
    return (req, res, next) => {
      const userRoles = req.user.roles;
      const hasPermission = requiredRoles.some((role) => userRoles.includes(role));
  
      if (!hasPermission) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  }; 
  
  module.exports = { roleMiddleware, checkRole };
  