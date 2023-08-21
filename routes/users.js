import { Router } from 'express';
import authenticateJWT from '../middlewares/authMiddleware.js';
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/users.js';

const router = Router();

router.get('/', authenticateJWT, getAllUsers);
router.post('/', createUser);
router.get('/:id', authenticateJWT, getUserById);
router.put('/:id', authenticateJWT, updateUser);
router.delete('/:id', authenticateJWT, deleteUser);

export default router;
