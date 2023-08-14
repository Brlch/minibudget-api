import db from '../models/index.js';
import bcrypt from 'bcryptjs'
const { User } = db;

export async function getAllUsers(req, res) {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//Register user
export async function createUser(req, res) {
    try {
        const { password } = req.body;  // Destructure password from request body
        bcrypt.hash(password, 10).then(async (hash) => {
            // Replace plain password with hashed password
            req.body.password = hash;
            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getUserById(req, res) {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateUser(req, res) {
    try {
        const updated = await User.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated[0] === 0) { // If no rows are affected
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json({ message: 'User updated successfully' });
        }
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteUser(req, res) {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id }
        });

        if (deleted === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json({ message: 'User deleted successfully' });
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
