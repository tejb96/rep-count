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

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/google" }),
    (req, res) => {
        // Session is set automatically by Passport
        res.redirect(clientUrl); // Redirect to frontend
    }
);

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) console.error("Logout error:", err);
        res.redirect(clientUrl);
    });
});

export default router;
