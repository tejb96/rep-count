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
            enum: ['PushUps', 'squat', 'pullup', 'SitUps', 'deadlift'], // Added 'deadlift'
        },
        repetitions: {
            type: Number,
            required: true,
            min: [1, 'Repetitions must be at least 1'],
        },
        date: {
            type: Date,
            required: true,
            default: Date.now, // Automatically set to the current date/time
        },
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

const Repetition = mongoose.model('Repetition', repetitionSchema);

export default Repetition;