import { Router } from 'express';
const router = Router();
import { getAllTransactions, create, getById, update, deleteTransaction, getTransactionsByUserId } from '../controllers/transactions.js';

router.get('/', getAllTransactions);
router.post('/', create);
router.get('/user/:userId', getTransactionsByUserId);  // Moved this up
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteTransaction);

export default router;
