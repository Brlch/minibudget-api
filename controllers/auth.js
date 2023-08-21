import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import '../config.js'; 

const { User } = db;

const jwtSecret = process.env.JWT_SECRET;

export async function loginUser(req, res) {
    try {
        console.log("Attempt login")
        console.log(req.body)
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
