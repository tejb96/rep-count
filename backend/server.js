import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connectDB from "./mongodb/connect.js";
import passport from "passport";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit: '20mb'}));

app.get('/', (req, res) => {
    res.send({message: 'app running'});
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

const port = process.env.PORT || 8080;

const startserver = async() => {
    try{
        connectDB(process.env.MONGODB_URL);
        app.listen(port, () => {
            console.log('Listening on port ' + port);
        })
    } catch (error){
        console.error(error);
    }
}

startserver();
