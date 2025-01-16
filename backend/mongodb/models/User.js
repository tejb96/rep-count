import fs from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { isValidUrl } from '../../utils/utils.js';
// import { IMAGES_FOLDER_PATH } from '../utils/constants';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        provider: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            index: true,
        },
        password: {
            type: String,
            trim: true,
            minlength: 6,
            maxlength: 60,
        },
        name: String,
        avatar: String,
        role: { type: String, default: 'USER' },
        bio: String,
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
    // if not exists avatar1 default
    const absoluteAvatarFilePath = `${join(__dirname, '../..', IMAGES_FOLDER_PATH)}${this.avatar}`;
    const avatar = isValidUrl(this.avatar)
        ? this.avatar
        : fs.existsSync(absoluteAvatarFilePath)
            ? `${IMAGES_FOLDER_PATH}${this.avatar}`
            : `${IMAGES_FOLDER_PATH}avatar2.jpg`;

    return {
        id: this._id,
        provider: this.provider,
        email: this.email,
        username: this.username,
        avatar: avatar,
        name: this.name,
        role: this.role,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

userSchema.methods.generateJWT = function () {
    const token = jwt.sign(
        {
            expiresIn: '6h',
            id: this._id,
            provider: this.provider,
            email: this.email,
        },
        secretOrKey,
    );
    return token;
};

const User = mongoose.model('User', userSchema);

export default User;