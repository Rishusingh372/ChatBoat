import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ error: "Invalid token." });
        }

        req.userId = decoded.userId;
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in authentication middleware:", error);
        res.status(401).json({ error: "Invalid token." });
    }
};