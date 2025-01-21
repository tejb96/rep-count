import { Router } from 'express';
import User from './users.js';



const apiRoutes = Router();

apiRoutes.use('/user', User);


export default apiRoutes;