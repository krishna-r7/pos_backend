"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const publicPaths = [
        '/api/user/create',
        '/api/user/login'
    ];
    const dynamicPublicPaths = [
        '/api/product/getproductbycategory/',
    ];
    // Allow public routes
    if (publicPaths.includes(req.path) ||
        dynamicPublicPaths.some(path => req.path.startsWith(path))) {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // console.log(authHeader);
        const token = authHeader.split(' ')[1];
        // console.log(token);
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Store decoded token in req.user
            // console.log(req.user,'user')
            next();
        }
        catch (error) {
            return res.status(707).json({ message: 'Invalid or expired token', status_code: 707, data: null });
        }
    }
    else {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
};
exports.verifyToken = verifyToken;
