import { Router } from 'express';
import googleAuthRoutes from './googleAuth';
import apiRoutes from './api';
const router = Router();

router.use('/auth', googleAuthRoutes);
router.use('/api', apiRoutes);
// fallback 404
router.use('/api', (req, res) => res.status(404).json('No route for this path'));

export default router;

