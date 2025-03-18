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
        const { token } = req.user; // Get token from strategy
        res.cookie('jwt', token, {
            httpOnly: true, // Prevent JS access
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict', // CSRF protection
            maxAge: 60 * 60 * 1000 // 1 hour (match JWT expiration)
        });
        res.redirect(`${clientUrl}/login-success`); // Redirect to frontend success page
    }
);

router.get("/logout", (req, res) => {
    res.clearCookie('jwt'); // Clear the JWT cookie
    res.redirect(clientUrl);
});

export default router;
