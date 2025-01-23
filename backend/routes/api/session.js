// Create a new workout session
router.post('/sessions', async (req, res) => {
    try {
        const { user, startTime, workoutType } = req.body;

        const newSession = new WorkoutSession({
            user,
            startTime,
            workoutType,
        });

        const savedSession = await newSession.save();
        res.status(201).json(savedSession);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// End a workout session and calculate total reps
router.put('/sessions/:id/end', async (req, res) => {
    try {
        const { id } = req.params;
        const { endTime } = req.body;

        const session = await WorkoutSession.findById(id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const repetitions = await Repetition.find({ workoutSession: id });
        const totalReps = repetitions.reduce((sum, rep) => sum + rep.repetitions, 0);

        session.endTime = endTime;
        session.totalReps = totalReps;
        await session.save();

        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all sessions for a user
router.get('/sessions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const sessions = await WorkoutSession.find({ user: userId }).sort({ startTime: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get highest reps for a user by workout type
router.get('/max-reps/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const maxReps = await Repetition.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$type', maxReps: { $max: '$repetitions' } } },
        ]);

        res.status(200).json(maxReps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get global leaderboard (users with highest reps for each workout type)
router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Repetition.aggregate([
            {
                $group: {
                    _id: { type: '$type', user: '$user' },
                    maxReps: { $max: '$repetitions' },
                },
            },
            { $sort: { '_id.type': 1, maxReps: -1 } },
            {
                $group: {
                    _id: '$_id.type',
                    topUser: { $first: '$_id.user' },
                    maxReps: { $first: '$maxReps' },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'topUser',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    _id: 0,
                    workoutType: '$_id',
                    maxReps: 1,
                    userName: '$userDetails.name',
                },
            },
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});