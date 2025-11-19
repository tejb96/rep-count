// middleware/auth.js
import passport from 'passport';


export const protect = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized — please log in again',
            });
        }
        req.user = user; 
        next();
    })(req, res, next);
};