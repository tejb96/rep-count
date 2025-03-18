// ./oAuth/passport-jwt.js
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import passport from "passport";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-secret-key', // Use your secret key
};

passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id); // Extract user from JWT payload
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            done(err, false);
        }
    })
);

export default passport;
