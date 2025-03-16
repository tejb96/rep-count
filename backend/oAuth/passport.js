import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import User from "../models/User.js";

const googleLogin = new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleId: profile.id });
                    if (!user) {
                        user = new User({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            name: profile.displayName,
                        });
                        await user.save();
                    }
                    return done(null, user); // Store user in session
                } catch (err) {
                    return done(err, null);
                }
            }


    );

passport.use(googleLogin);


    // Serialize/deserialize user for session
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });


export default passport;
