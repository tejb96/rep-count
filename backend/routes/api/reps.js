import express from 'express';
import Repetition from '../../models/Repitions.js'; // Fixed typo: Repitions -> Repetitions (if applicable)
import auth from '../../middleware/auth.js'; // Session-based auth
import mongoose from 'mongoose'; // For ObjectId validation
import rateLimit from 'express-rate-limit';
import csurf from 'csurf'; // For CSRF protection

const router = express.Router();

// Rate limiting: 100 requests per IP per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// CSRF protection (cookie-based, matches express-session)
const csrfProtection = csurf({ cookie: true });

// Apply rate limiting to all routes
router.use(limiter);

// Create a new repetition - Auth and CSRF required
router.post('/addSet', auth, csrfProtection, async (req, res) => {
    try {
        const { user, type, repetitions, date } = req.body;

        // Validate required fields
        if (!user || !type || !repetitions || !date) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Ensure the authenticated user matches the request body user
        if (req.user.id !== user) {
            return res.status(403).json({ success: false, message: 'Unauthorized to add repetition for this user' });
        }

        const newRepetition = new Repetition({
            user,
            type,
            repetitions,
            date,
        });

        const savedRepetition = await newRepetition.save();
        res.status(201).json({ success: true, repetition: savedRepetition });
    } catch (error) {
        console.error('Error in POST /addSet:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all repetitions for a user
router.get('/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        // Ensure the authenticated user matches the requested userId
        if (req.user.id !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to view this user’s repetitions' });
        }

        const repetitions = await Repetition.find({ user: userId }).populate('user', 'name email');
        res.status(200).json({ success: true, repetitions });
    } catch (error) {
        console.error('Error in GET /:userId:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update a repetition - Auth and CSRF required
router.put('/:id', auth, csrfProtection, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid repetition ID' });
        }

        // Check if the repetition belongs to the authenticated user
        const repetition = await Repetition.findById(id);
        if (!repetition) {
            return res.status(404).json({ success: false, message: 'Repetition not found' });
        }
        if (repetition.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this repetition' });
        }

        const updatedRepetition = await Repetition.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, repetition: updatedRepetition });
    } catch (error) {
        console.error('Error in PUT /:id:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a repetition - Auth and CSRF required
router.delete('/:id', auth, csrfProtection, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid repetition ID' });
        }

        // Check if the repetition belongs to the authenticated user
        const repetition = await Repetition.findById(id);
        if (!repetition) {
            return res.status(404).json({ success: false, message: 'Repetition not found' });
        }
        if (repetition.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this repetition' });
        }

        await Repetition.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Repetition deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /:id:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;