import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connectDB from './mongodb/connect.js';
import './oAuth/passport.js';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

//middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL_DEV,
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

app.use(cookieParser());

app.use(express.json());

// Base route
app.get('/', (req, res) => {
    res.send({ message: 'App running' });
});

// Use the centralized router
app.use(routes);

const port = process.env.PORT || 8080;

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(port, () => {
            console.log('Listening on port ' + port);
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();
