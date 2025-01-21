import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../mongodb/models/User.js';
import dotenv from 'dotenv';

dotenv.config(); // Load variables from .env file

// Server URL based on environment
const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;

// JWT secret
const jwtSecret = process.env.JWT_SECRET;

// Google strategy
const googleLogin = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`,
        proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            const picture = profile.photos?.[0]?.value;

            // Find an existing user
            let user = await User.findOne({ email });

            if (!user) {
                // Create a new user if not found
                user = await new User({
                    googleId: profile.id,
                    username: `user${profile.id}`,
                    email,
                    name: profile.displayName,
                    avatar: picture,
                }).save();
            }

            // Issue a JWT for the user
            const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

            // Pass user and token to the done callback
            return done(null, { user, token });
        } catch (err) {
            console.error('Error during Google Strategy authentication:', err);
            done(err, null);
        }
    },
);

// Register the Google strategy with Passport
passport.use(googleLogin);

export default passport;
