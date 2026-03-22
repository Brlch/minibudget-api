import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import '../config.js';

const { User } = db;
const jwtSecret = process.env.JWT_SECRET;

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    // ✅ Input validation FIRST
    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required.'
      });
    }

    // Optional dev-only logging
    if (process.env.NODE_ENV !== 'production') {
      console.log('Attempt login', { username });
    }

    // 🔍 Find user
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed. User not found.'
      });
    }

    // 🔐 Validate password
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        error: 'Authentication failed. Password is incorrect.'
      });
    }

    // 🎟️ Issue JWT
    const token = jwt.sign(
      { id: user.id },
      jwtSecret,
      { expiresIn: 86400 } // 24 hours
    );

    return res.status(200).json({ token });

  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}
