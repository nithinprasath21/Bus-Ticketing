const JwtUtils = require("../utils/jwtUtils");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    req.user = JwtUtils.verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authorizeRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: You do not have access" });
  }
  next();
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

const isOperator = (req, res, next) => {
  if (!req.user || req.user.role !== "operator") {
    return res.status(403).json({ message: "Access denied: Operators only" });
  }
  next();
};

module.exports = { verifyToken, authorizeRole, verifyAdmin, isOperator };
