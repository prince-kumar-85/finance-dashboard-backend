const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Authorization token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, 401, 'User not found');
    }

    if (user.status !== 'active') {
      return errorResponse(res, 403, 'User account is inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Unauthorized access');
  }
};

module.exports = authMiddleware;
