import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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
        avatar: String,
        role: { type: String, default: 'USER' },

    },
    { timestamps: true },
);

// JWT token verification and expiration check
userSchema.methods.isTokenValid = function (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const now = Date.now() / 1000; // Current time in seconds
        return decoded.exp > now;
    } catch (err) {
        return false;
    }
};

// To JSON method
userSchema.methods.toJSON = function () {
    return {
        id: this._id,

        email: this.email,


        name: this.name,
        role: this.role,

        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

const User = mongoose.model('User', userSchema);

export default User;
