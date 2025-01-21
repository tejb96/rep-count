import passport from 'passport';

const requireJwtAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false })(req, res, (err) => {
        if (err || !req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Ensure that the token is valid and not expired
        const now = Date.now() / 1000; // current time in seconds
        if (req.user.exp < now) {
            return res.status(401).json({ message: 'Token has expired' });
        }

        next();
    });
};

export default requireJwtAuth;
