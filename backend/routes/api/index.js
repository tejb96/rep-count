import { Router } from 'express';
import usersRoutes from './users';
import repRoutes from './repCounts.js';
const router = Router();

router.use('/users', usersRoutes);
router.use('/repCounts', repRoutes);

export default router;