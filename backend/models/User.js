import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        email: {
            type: String,
            unique: true,
            required: [true],
        },
        name: {
            type: String,
            required: true,
        },
        avatar: { type: String, default: '/logo.jpg' },
        role: { type: String, default: 'USER' },

    },
    { timestamps: true },
);


const User = mongoose.model('User', userSchema);

export default User;
