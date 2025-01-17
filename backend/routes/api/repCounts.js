import express from 'express';
import RepCount from './../../mongodb/models/RepCount.js'; // Adjust the path as necessary
import requireJwtAuth from './../../middleware/requireJwtAuth.js'; // Use JWT authentication middleware

const router = express.Router();

// Create a new rep count
router.post('/api/reps', requireJwtAuth, async (req, res) => {
    const { exercise, reps } = req.body;
    const userId = req.user._id; // Assuming user ID is stored in req.user after authentication

    try {
        const newRepCount = new RepCount({ userId, exercise, reps });
        await newRepCount.save();
        res.status(201).json(newRepCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Read all rep counts for a user
router.get('/api/reps', requireJwtAuth, async (req, res) => {
    const userId = req.user._id;

    try {
        const repCounts = await RepCount.find({ userId }).sort({ date: -1 });
        res.status(200).json(repCounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a specific rep count
router.put('/api/reps/:id', requireJwtAuth, async (req, res) => {
    const { id } = req.params;
    const { exercise, reps } = req.body;
    const userId = req.user._id;

    try {
        const repCount = await RepCount.findOneAndUpdate(
            { _id: id, userId }, // Ensure the user owns the rep count
            { exercise, reps },
            { new: true } // Return the updated document
        );

        if (!repCount) {
            return res.status(404).json({ message: 'Rep count not found or unauthorized' });
        }

        res.status(200).json(repCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a specific rep count
router.delete('/api/reps/:id', requireJwtAuth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const repCount = await RepCount.findOneAndDelete({ _id: id, userId });

        if (!repCount) {
            return res.status(404).json({ message: 'Rep count not found or unauthorized' });
        }

        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
