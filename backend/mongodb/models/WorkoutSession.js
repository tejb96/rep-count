import mongoose from 'mongoose';

const { Schema } = mongoose;

const workoutSessionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
        },
        totalReps: {
            type: Number,
            default: 0,
        },
        workoutType: {
            type: String,
            enum: ['pushup', 'squat', 'pullup', 'situp', 'deadlift'],
        },
    },
    { timestamps: true }
);

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);