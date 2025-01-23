import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth.js';
import User from '../../mongodb/models/User.js';

const userRoutes = Router();

// Get current user information (me)
userRoutes.get('/me', requireJwtAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);  // Using req.user.id
        if (!user) return res.status(404).json({ message: 'No user found.' });
        res.json({ user: user.toJSON() });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// Get user by ID (use req.user.id instead of params.id)
userRoutes.get('/:id', requireJwtAuth, async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {  // Ensure the requester matches the user being fetched
            return res.status(403).json({ message: 'You do not have privileges to access this user.' });
        }

        const user = await User.findById(req.params.id);  // Find user by ID
        if (!user) return res.status(404).json({ message: 'No user found.' });
        res.json({ user: user.toJSON() });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// Update user by ID (use req.user.id)
userRoutes.put('/:id', requireJwtAuth, async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {  // Ensure requester matches the user being updated
            return res.status(403).json({ message: 'You do not have privileges to update this user.' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'No such user.' });

        res.status(200).json({ user: updatedUser.toJSON() });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// Delete user by ID (use req.user.id)
userRoutes.delete('/:id', requireJwtAuth, async (req, res) => {
    try {
        if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {  // Ensure requester has permissions to delete
            return res.status(403).json({ message: 'You do not have privileges to delete this user.' });
        }

        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).json({ message: 'No such user.' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

export default userRoutes;
