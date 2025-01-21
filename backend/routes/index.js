import { Router } from 'express';
import router from './googleAuth.js';
import apiRoutes from './api/index.js';

const routes = Router();

routes.use('/auth', router);
routes.use('/api', apiRoutes);
// fallback 404
routes.use('/api', (req, res) => res.status(404).json('No route for this path'));

export default routes;

