const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(`${err.message || 'Unknown error'} - ${req.originalUrl} - ${req.method} - ${req.ip}`, { error: err });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: message
    }
  });
};
