import { Router } from 'express';
import multer from 'multer';
import { resolve } from 'path';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import User from '../../models/User';
import WorkoutStats from '../../mongodb/models/WorkoutStats.js';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, resolve(__dirname, '../../../public/images'));
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, `avatar-${Date.now()}-${fileName}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});


router.get('/me', requireJwtAuth, (req, res) => {
    const me = req.user.toJSON();
    res.json({ me });
});

router.get('/:username', requireJwtAuth, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'No user found.' });
        res.json({ user: user.toJSON() });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

router.get('/', requireJwtAuth, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: 'desc' });

        res.json({
            users: users.map((m) => {
                return m.toJSON();
            }),
        });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
    try {
        const tempUser = await User.findById(req.params.id);
        if (!tempUser) return res.status(404).json({ message: 'No such user.' });
        if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN'))
            return res.status(400).json({ message: 'You do not have privilegies to delete that user.' });


        //delete all messages from that user
        await WorkoutStats.deleteMany({ user: tempUser.id });
        //delete user
        const user = await User.findByIdAndRemove(tempUser.id);
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

export default router;