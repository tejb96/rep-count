import { Router } from 'express';
import passport from '../oAuth/passport.js';
import jwt from 'jsonwebtoken';
import User from '../mongodb/models/User.js';

const jwtSecret = process.env.JWT_SECRET;
const router = Router();

const clientUrl =
    process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

console.log(clientUrl);

// Google authentication route
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'], // Request email and profile scopes
        session: false,
    }),
);

// Google callback route
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google', session: false }),
    async (req, res) => {
        try {
            const email = req.user.emails[0].value; // Get email from the profile
            const picture = req.user.photos[0].value; // Get picture from the profile

            // Find an existing user
            let user = await User.findOne({ email });

            if (!user) {
                // Create a new user if not found
                user = await new User({
                    googleId: req.user.id,
                    username: `user${req.user.id}`,
                    email,
                    name: req.user.displayName,
                    avatar: picture,
                }).save();
            }

            // Issue a JWT for the user
            const token = jwt.sign({ id: user._id}, jwtSecret, { expiresIn: '1d' });

            // Set the token in an HTTP-only cookie
            res.cookie('x-auth-token', token, {
                httpOnly: true,
                secure: true, // Secure cookie in production
                sameSite: 'none',
                maxAge: 1 * 24 * 60 * 60 * 1000,
            });

            // Redirect the user to the client application
            res.redirect(clientUrl);
        } catch (err) {
            console.error('Error during Google callback:', err);
            res.redirect('/'); // Redirect to home or an error page
        }
    },
);

// Logout route
router.get(
    '/logout',
    async (req, res) => {
        try {
            // Clear the JWT cookie by setting its value to an empty string and expiring immediately
            res.clearCookie('x-auth-token', { httpOnly: true, secure: true, sameSite: 'Strict' });

            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
);


export default router;
