import db from '../models/index.js';
import bcrypt from 'bcryptjs';

const { Transaction, User } = db;

const ensureSelf = (req, res) => {
  if (!req.user || Number(req.params.id) !== req.user.id) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }

  return true;
};

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createUser(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required.'
      });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    console.error('Error creating user:', err);
    if (err.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function getUserById(req, res) {
  if (!ensureSelf(req, res)) {
    return;
  }

  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

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
  if (!ensureSelf(req, res)) {
    return;
  }

  try {
    const updatePayload = { ...req.body };
    delete updatePayload.password;

    const [updatedCount] = await User.update(updatePayload, {
      where: { id: req.params.id }
    });

    if (updatedCount === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      res.status(200).json(user);
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteUser(req, res) {
  if (!ensureSelf(req, res)) {
    return;
  }

  try {
    await Transaction.destroy({
      where: { userId: req.params.id },
      force: true,
      paranoid: false
    });

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
