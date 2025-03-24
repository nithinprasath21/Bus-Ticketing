const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

class JwtUtils {
  generateToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });
  }

  verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
  }
}

module.exports = new JwtUtils();
