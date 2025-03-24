const jwtUtils = require("../utils/jwtUtils");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Unauthorized" });

  try {
    req.user = jwtUtils.verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};

module.exports = { verifyToken, authorizeRole };
