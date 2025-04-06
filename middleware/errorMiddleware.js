const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error(`${err.message} - ${req.method} ${req.url}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
};

module.exports = errorMiddleware;
