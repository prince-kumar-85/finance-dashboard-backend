const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'CastError') {
    return errorResponse(res, 400, 'Invalid resource id');
  }

  if (err.code === 11000) {
    return errorResponse(res, 409, 'Duplicate value found');
  }

  return errorResponse(
    res,
    err.statusCode || 500,
    err.message || 'Internal server error'
  );
};

module.exports = errorHandler;
