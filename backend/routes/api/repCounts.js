import express from 'express';
import RepCount from './../../mongodb/models/RepCount.js'; // Adjust the path as necessary
import requireJwtAuth from './../../middleware/requireJwtAuth.js'; // Use JWT authentication middleware

const router = express.Router();

/*
Routes:

POST /api/reps - Create a new rep count for the authenticated user.
    Request Body:
        {
            "exercise": "string", // Name of the exercise
            "reps": number // Number of repetitions
        }
    Response:
        201 Created - Returns the newly created rep count object.
        500 Server Error - If there is an issue saving to the database.

GET /api/reps - Retrieve all rep counts for the authenticated user.
    Response:
        200 OK - Returns an array of rep count objects sorted by date in descending order.
        500 Server Error - If there is an issue retrieving from the database.

PUT /api/reps/:id - Update a specific rep count for the authenticated user.
    Parameters:
        id: string - The ID of the rep count to update.
    Request Body:
        {
            "exercise": "string", // Updated name of the exercise
            "reps": number // Updated number of repetitions
        }
    Response:
        200 OK - Returns the updated rep count object.
        404 Not Found - If the rep count is not found or the user is unauthorized.
        500 Server Error - If there is an issue updating the database.

DELETE /api/reps/:id - Delete a specific rep count for the authenticated user.
    Parameters:
        id: string - The ID of the rep count to delete.
    Response:
        204 No Content - Successfully deleted the rep count.
        404 Not Found - If the rep count is not found or the user is unauthorized.
        500 Server Error - If there is an issue deleting from the database.
*/


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
