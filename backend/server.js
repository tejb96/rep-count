import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connectDB from './models/connect.js';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import csurf from 'csurf';
import './oAuth/passport.js';

dotenv.config();

const app = express();

app.set('trust proxy', 3);

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(301, 'https://' + req.headers.host + req.url);
        }
        next();
    });
}

const corsOrigin = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

app.use(cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'], // Added X-CSRF-Token
}));

app.use(passport.initialize());
app.use(cookieParser());

// CSRF protection middleware
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// Expose CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use(express.json());
app.get('/', (req, res) => res.send({ message: 'App running' }));
app.use(routes);

const port = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(port, () => console.log('Listening on port ' + port));
    } catch (error) {
        console.error(error);
    }
};

startServer();