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

const startserver = async() => {
    try{
        connectDB(process.env.MONGODB_URI);
    } catch (error){
        console.error(error);
    }
}
const port = process.env.PORT || 3001;
app.listen(port, () => {

})