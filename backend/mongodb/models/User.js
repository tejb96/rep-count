import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
// import { IMAGES_FOLDER_PATH } from '../utils/constants';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: String,
        role: { type: String, default: 'USER' },
        // google
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    },
    { timestamps: true },
);


userSchema.methods.toJSON = function () {
    return {
        id: this._id,
        name: this.name,
        role: this.role,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

userSchema.methods.generateJWT = function () {
    return jwt.sign(
        {
            expiresIn: '6h',
            id: this._id,
        },
        secretOrKey,
    );
};

const User = mongoose.model('User', userSchema);

export default User;