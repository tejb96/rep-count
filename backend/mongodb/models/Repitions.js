import mongoose from 'mongoose';

const { Schema } = mongoose;

const repetitionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['pushup', 'squat', 'pullup', 'situp'], // Example workout types
        },
        repetitions: {
            type: Number,
            required: true,
            min: [1, 'Repetitions must be at least 1'],
        },
        duration: {
            type: Number,
            required: [true, 'Workout duration is required'],
            min: [1, 'Duration must be at least 1 minute'],
        },
        date: {
            type: Date,
            required: true,
        },
        workoutSession: {
            type: Schema.Types.ObjectId, // Group repetitions into sessions
            ref: 'WorkoutSession',
        },
    },
    { timestamps: true }
);

const Repetition = mongoose.model('Repetition', repitionSchema);

export default Repetition;
