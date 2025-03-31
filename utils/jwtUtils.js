const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "efc50a985a4543b124f686b4fd5bb383c5c55dcc994b22a9d84d866017b2d81e";
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
