// routes/api/reps.js
import { Router } from 'express';
import Repetition from '../../models/Repetitions.js';
import { protect } from '../../middleware/auth.js';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import repetitionSchemas from '../../validators/repetitionValidator.js';
import validate from '../../middleware/validate.js';

const router = Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later' },
});

router.use(limiter);
router.use(protect); 

// Create repetition
router.post('/addSet', validate(repetitionSchemas.createRepetitionSchema), async (req, res) => {
    const { user, type, repetitions, date } = req.body;

    if (req.user._id.toString() !== user) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const newRep = await Repetition.create({ user, type, repetitions, date });
        res.status(201).json({ success: true, repetition: newRep });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all reps for logged-in user
router.get('/:userId', async (req, res) => {
    if (req.user._id.toString() !== req.params.userId)
        return res.status(403).json({ success: false, message: 'Access denied' });

    if (!mongoose.Types.ObjectId.isValid(req.params.userId))
        return res.status(400).json({ success: false, message: 'Invalid user ID' });

    const reps = await Repetition.find({ user: req.params.userId })
        .populate('user', 'name email')
        .sort({ date: -1 });

    res.json({ success: true, repetitions: reps });
});

// Update repetition
router.put('/:id', validate(repetitionSchemas.updateRepetitionSchema), async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).json({ success: false, message: 'Invalid ID' });

    const rep = await Repetition.findById(req.params.id);
    if (!rep) return res.status(404).json({ success: false, message: 'Not found' });
    if (rep.user.toString() !== req.user._id.toString())
        return res.status(403).json({ success: false, message: 'Unauthorized' });

    const updated = await Repetition.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    res.json({ success: true, repetition: updated });
});

// Delete repetition
router.delete('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).json({ success: false, message: 'Invalid ID' });

    const rep = await Repetition.findById(req.params.id);
    if (!rep) return res.status(404).json({ success: false, message: 'Not found' });
    if (rep.user.toString() !== req.user._id.toString())
        return res.status(403).json({ success: false, message: 'Unauthorized' });

    await Repetition.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
});

export default router;