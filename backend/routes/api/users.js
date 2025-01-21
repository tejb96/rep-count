import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth.js';


const User = Router();

// Get current user information (me)
User.get('/me', requireJwtAuth, (req, res) => {
    const me = req.user.toJSON();
    res.json({ me });
});

// Get user by username
User.get('/:username', requireJwtAuth, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'No user found.' });
        res.json({ user: user.toJSON() });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// Get all users
User.get('/', requireJwtAuth, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: 'desc' });

        res.json({
            users: users.map((m) => m.toJSON()),
        });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// Delete user by ID (with admin check)
User.delete('/:id', requireJwtAuth, async (req, res) => {
    try {
        const tempUser = await User.findById(req.params.id);
        if (!tempUser) return res.status(404).json({ message: 'No such user.' });
        if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN'))
            return res.status(400).json({ message: 'You do not have privileges to delete that user.' });

        // Delete all associated workouts of the user
        await WorkoutStats.deleteMany({ user: tempUser.id });
        // Delete user
        const user = await User.findByIdAndRemove(tempUser.id);
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

export default User;
