const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`);

  res.status(400).json({
    success: false,
    message: err.message || "Bad Request",
  });
};

module.exports = errorMiddleware;
