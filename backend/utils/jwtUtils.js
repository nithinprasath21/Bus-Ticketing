const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

class JwtUtils {
  static generateToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }
}

module.exports = JwtUtils;
