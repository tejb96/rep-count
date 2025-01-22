import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

console.log("passportjs",process.env.NODE_ENV);
// Server URL based on environment
const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;

// Google strategy
const googleLogin = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`,
        proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
        // Pass the profile to the done callback without processing it here
        return done(null, profile);
    },
);

// Register the Google strategy with Passport
passport.use(googleLogin);

export default passport;
