import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    // Check cookie first, fallback to Authorization header
    const token = req.cookies?.jwt || (req.headers['authorization']?.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        req.user = decoded; // Attach decoded user data to request
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        return res.status(401).json({ success: false, message: "Unauthorized, invalid token" });
    }
};