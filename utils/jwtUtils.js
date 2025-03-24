const jwt = require("jsonwebtoken");

class JwtUtils {
  static generateToken(user) {
    if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY is missing in .env");
    return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRY || "1d" });
  }

  static verifyToken(token) {
    if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY is missing in .env");
    return jwt.verify(token, process.env.SECRET_KEY);
  }
}

module.exports = JwtUtils;
