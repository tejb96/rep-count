import mongoose from "mongoose";

const { Schema } = mongoose;

const reps = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exercise: { type: String, required: true },
    reps: { type: Number, required: true },
    date: { type: Date, default: Date.now },
})

const RepCount = mongoose.model('Stats', reps);
module.exports = RepCount;