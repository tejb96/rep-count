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

// Google callback route
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    (req, res) => {
        const { user, token } = req.user; // Access user and token from req.user

        // Set the token in an HTTP-only cookie
        res.cookie('x-auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookie in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Redirect the user to the client application
        res.redirect(clientUrl);
    },
);

export default router;
