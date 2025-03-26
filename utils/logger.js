const winston = require("winston");
const path = require("path");

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(), // Logs in console
    new winston.transports.File({ filename: path.join(__dirname, "../logs/app.log"), level: "info" }),
    new winston.transports.File({ filename: path.join(__dirname, "../logs/errors.log"), level: "error" })
  ],
});

module.exports = logger;
