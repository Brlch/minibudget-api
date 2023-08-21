import { Router } from 'express';
import authenticateJWT from '../middlewares/authMiddleware.js';
import { getAllTransactions, create, getById, update, deleteTransaction, getTransactionsByUserId } from '../controllers/transactions.js';

const router = Router();

router.get('/', authenticateJWT, getAllTransactions);
router.post('/', authenticateJWT, create);
router.get('/user/:userId', authenticateJWT, getTransactionsByUserId);
router.get('/:id', authenticateJWT, getById);
router.put('/:id', authenticateJWT, update);
router.delete('/:id', authenticateJWT, deleteTransaction);

export default router;
