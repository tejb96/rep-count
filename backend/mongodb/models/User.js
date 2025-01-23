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


// To JSON method
userSchema.methods.toJSON = function () {
    return {
        id: this._id,

        email: this.email,

        avatar: this.avatar,
        name: this.name,
        role: this.role,

        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

const User = mongoose.model('User', userSchema);

export default User;
