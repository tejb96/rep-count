import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connectDB from "./mongodb/connect.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit: '20mb'}));

app.get('/', (req, res) => {
    res.send({message: 'app running'});
})

const port = process.env.PORT || 8080;

const startserver = async() => {
    try{
        connectDB(process.env.MONGODB_URI);
        app.listen(port, () => {
            console.log('Listening on port ' + port);
        })
    } catch (error){
        console.error(error);
    }
}

startserver();
