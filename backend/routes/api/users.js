import { Router } from 'express';
import auth from '../../middleware/auth.js'; // Session-based middleware
import User from '../../models/User.js';
import mongoose from 'mongoose'; // For ObjectId validation
import rateLimit from 'express-rate-limit'; // For rate limiting
// import csurf from 'csurf'; // For CSRF protection

const userRoutes = Router();

// Rate limiting: 100 requests per IP per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25,
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// CSRF protection (cookie-based, matches express-session)
// const csrfProtection = csurf({ cookie: true });

// Apply rate limiting to all routes
userRoutes.use(limiter);

// Get current user information (me) - No CSRF needed (read-only)
userRoutes.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found' });
        }
        res.json({ success: true, user: user.toJSON() });
    } catch (err) {
        console.error('Error in /me:', err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});

// Get user by ID
userRoutes.get('/:id', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        if (req.user.id !== req.params.id) {
            return res.status(403).json({ success: false, message: 'You do not have privileges to access this user' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found' });
        }
        res.json({ success: true, user: user.toJSON() });
    } catch (err) {
        console.error('Error in GET /:id:', err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});

// // Update user by ID - CSRF protection added
// userRoutes.put('/:id', auth, csrfProtection, async (req, res) => {
//     try {
//         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({ success: false, message: 'Invalid user ID' });
//         }
//
//         if (req.user.id !== req.params.id) {
//             return res.status(403).json({ success: false, message: 'You do not have privileges to update this user' });
//         }
//
//         const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ success: false, message: 'No such user' });
//         }
//         res.status(200).json({ success: true, user: updatedUser.toJSON() });
//     } catch (err) {
//         console.error('Error in PUT /:id:', err);
//         res.status(500).json({ success: false, message: 'Something went wrong' });
//     }
// });
//
// // Delete user by ID - CSRF protection added
// userRoutes.delete('/:id', auth, csrfProtection, async (req, res) => {
//     try {
//         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({ success: false, message: 'Invalid user ID' });
//         }
//
//         if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {
//             return res.status(403).json({ success: false, message: 'You do not have privileges to delete this user' });
//         }
//
//         const user = await User.findByIdAndDelete(req.params.id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'No such user' });
//         }
//         res.status(200).json({ success: true, message: 'User deleted successfully' });
//     } catch (err) {
//         console.error('Error in DELETE /:id:', err);
//         res.status(500).json({ success: false, message: 'Something went wrong' });
//     }
// });

export default userRoutes;