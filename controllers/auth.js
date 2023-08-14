import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { User } = db;

const jwtSecret =
  "e3c5d9f9c0200ef05c65ea75b7d1d64e93ceceb25fce32ea98afbdbcf3dfeaf09b39c3";

export async function loginUser(req, res) {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed. User not found.' });
        }

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Authentication failed. Password is incorrect.' });
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ token });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
