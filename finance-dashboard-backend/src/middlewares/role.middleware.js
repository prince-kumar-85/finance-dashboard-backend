const { errorResponse } = require('../utils/apiResponse');

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized access');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'You do not have permission to perform this action');
    }

    next();
  };
};

module.exports = authorizeRoles;
