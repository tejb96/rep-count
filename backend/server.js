import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connectDB from './models/connect.js';
import './oAuth/passport.js';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
    res.send({ message: 'App running' });
});

// Centralized router
app.use(routes);

const port = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(port, () => {
            console.log('Listening on port ' + port);
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();