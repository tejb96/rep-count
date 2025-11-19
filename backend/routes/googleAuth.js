// routes/googleAuth.js
import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

const CLIENT_URL = process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL_PROD
    : process.env.CLIENT_URL_DEV;

// Start Google login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// Google callback → set httpOnly JWT cookie
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${CLIENT_URL}/login?error=auth_failed`,
        session: false,
    }),
    (req, res) => {
        const { user } = req.user; 
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } 
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',       
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
            // domain: '.yoursite.com' 
        });

        res.redirect(`${CLIENT_URL}`); 
    }
);

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
    res.redirect(`${CLIENT_URL}/login`);
});

export default router;