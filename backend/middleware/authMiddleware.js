const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (req, res, next) => {
  // ton code existant
};

const protectAdmin = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé, admin seulement' });
      }

      req.userId = user._id;
      req.userRole = user.role;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  } else {
    return res.status(401).json({ message: 'Pas de token, accès refusé' });
  }
};

module.exports = { protect, protectAdmin };
