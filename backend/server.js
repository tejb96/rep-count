import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connectDB from './mongodb/connect.js';
import './oAuth/passport.js'; // Ensure Passport strategies are registered
import routes from './routes/index.js'; // Import the main routes index

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

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
