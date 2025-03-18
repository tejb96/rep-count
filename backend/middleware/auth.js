import jwt from 'jsonwebtoken';

export default (req, res, next) => {

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized, no token provided" });
    }


    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Unauthorized, invalid token" });
        }


        req.user = decoded;
        next();
    });
};
