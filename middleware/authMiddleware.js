const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel.js');

class AuthMiddleware {
    protectUser = async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.AuthToken;
            if (!token) return res.status(401).json({ error: 'Token not found' });
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    };

    protectOperator = async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.AuthToken;
            if (!token) return res.status(401).json({ message: 'Token not found' });
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id).select('-password');
            if (!user) return res.status(404).json({ message: 'User not found' });
            if (user.role !== "operator") return res.status(403).json({ message: 'Access denied: Not an operator' });

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    };

    protectAdmin = async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.AuthToken;
            if (!token) return res.status(401).json({ error: 'Token not found' });
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });
            if (user.role !== "admin") return res.status(403).json({ error: 'Access denied: Not an admin' });

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
}

module.exports = AuthMiddleware;
