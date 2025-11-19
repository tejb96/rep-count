// routes/api/users.js
import { Router } from 'express';
import { protect } from '../../middleware/auth.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

const userRoutes = Router();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 25,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later' },
});

userRoutes.use(limiter);

// Get current user
userRoutes.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-googleId -__v');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get own profile by ID (same as /me but via param)
userRoutes.get('/:id', protect, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).json({ success: false, message: 'Invalid user ID' });

    if (req.user._id.toString() !== req.params.id)
        return res.status(403).json({ success: false, message: 'Access denied' });

    const user = await User.findById(req.params.id).select('-googleId -__v');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
});

export default userRoutes;