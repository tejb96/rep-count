import express from 'express';
import Repetition from '../../models/Repetition.js'; // Adjust path if your models folder is different
import User from '../../models/User.js'; // Adjust path if your models folder is different

const router = express.Router();

// Create a new repetition
router.post('/', async (req, res) => {
    try {
        const { user, type, repetitions, duration, startDate, endDate } = req.body;

        if (!user || !type || !repetitions || !duration || !startDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newRepetition = new Repetition({
            user,
            type,
            repetitions,
            duration,
            startDate,
            endDate,
        });

        const savedRepetition = await newRepetition.save();
        res.status(201).json(savedRepetition);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all repetitions for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const repetitions = await Repetition.find({ user: userId }).populate('user', 'name email');
        res.status(200).json(repetitions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a repetition
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedRepetition = await Repetition.findByIdAndUpdate(id, updates, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validations are run on updates
        });

        if (!updatedRepetition) {
            return res.status(404).json({ error: 'Repetition not found' });
        }

        res.status(200).json(updatedRepetition);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a repetition
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRepetition = await Repetition.findByIdAndDelete(id);

        if (!deletedRepetition) {
            return res.status(404).json({ error: 'Repetition not found' });
        }

        res.status(200).json({ message: 'Repetition deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
