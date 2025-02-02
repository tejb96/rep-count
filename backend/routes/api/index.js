import { Router } from 'express';
import userRoutes from './users.js';
import reps from "./reps.js";



const apiRoutes = Router();

apiRoutes.use('/users', userRoutes);
apiRoutes.use('/reps', reps);


export default apiRoutes;