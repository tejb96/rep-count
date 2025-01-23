import jwt from 'jsonwebtoken';

const requireJwtAuth = (req, res, next) => {
    try {
        // Extract the token from the HTTP-only cookie
        const token = req.cookies['x-auth-token'];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);

        // Attach the decoded user to the request
        req.user = decoded;

        next();
    } catch (err) {
        console.error('JWT verification error:', err.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

export default requireJwtAuth;
