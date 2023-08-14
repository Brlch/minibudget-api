import { Router } from 'express';
const router = Router();
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/users.js';

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
