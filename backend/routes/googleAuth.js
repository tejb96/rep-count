import { Router } from 'express';
import passport from '../oAuth/passport.js';
const router = Router();

const clientUrl =
    process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;


// Google authentication route
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'], // Request email and profile scopes
    }),
);

router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/google",
        session: false // Explicitly disable sessions
    }),
    (req, res) => {
        const { token } = req.user;
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',           // Works with subdomains
            domain: process.env.Domain, // Share across subdomains
            maxAge: 60 * 60 * 1000,    // 1 hour
        });
        res.redirect(clientUrl);
    }
);

router.get("/logout", (req, res) => {
    res.clearCookie('jwt'); // Clear the JWT cookie
    res.redirect(clientUrl);
});

export default router;
