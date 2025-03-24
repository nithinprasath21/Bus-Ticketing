const logger = require("../logs/appLogger");

const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorMiddleware;
