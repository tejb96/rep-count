import express from 'express';
import Repetition from '../../models/Repitions.js';
import auth from '../../middleware/auth.js';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import csurf from 'csurf';
import repetitionSchemas  from '../../validators/repetitionValidator.js';
import validate from "../../middleware/validate.js";

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

const csrfProtection = csurf({ cookie: true });

router.use(limiter);

// Create a new repetition
router.post('/addSet', auth, csrfProtection, validate(repetitionSchemas.createRepetitionSchema), async (req, res) => {
    try {
        const { user, type, repetitions, date } = req.body;

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

// Update a repetition
router.put('/:id', auth, csrfProtection, validate(repetitionSchemas.updateRepetitionSchema), async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid repetition ID' });
        }

        const repetition = await Repetition.findById(id);
        if (!repetition) {
            return res.status(404).json({ success: false, message: 'Repetition not found' });
        }
        if (repetition.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this repetition' });
        }

        const updatedRepetition = await Repetition.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, repetition: updatedRepetition });
    } catch (error) {
        console.error('Error in PUT /:id:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a repetition
router.delete('/:id', auth, csrfProtection, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid repetition ID' });
        }

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