import db from '../models/index.js';

const { Transaction } = db;

export async function getAllTransactions(req, res) {
    try {
        const transactions = await Transaction.findAll();
        res.status(200).json(transactions);
    } catch (err) {
        console.error('Error retrieving transactions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export async function create(req, res) {
    try {

        if (!req.user || !req.user.id) {
            console.error('User ID missing from request');
            return res.status(400).json({ error: 'User ID required' });
        }
        const transactionData = {
            ...req.body,
            userId: req.user.id
        };
        const transaction = await Transaction.create(transactionData);
        res.status(201).json(transaction);
        
    } catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getById(req, res) {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (transaction) {
            res.status(200).json(transaction);
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (err) {
        console.error('Error fetching transaction:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function update(req, res) {
    try {
        const updated = await Transaction.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated[0] === 0) {
            res.status(404).json({ error: 'Transaction not found' });
        } else {
            res.status(200).json({ message: 'Transaction updated successfully' });
        }
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteTransaction(req, res) {
    try {
        const deleted = await Transaction.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getTransactionsByUserId(req, res) {
    try {

        const userId = req.params.userId;

        const transactions = await Transaction.findAll({
            where: { userId: userId }
        });

        res.status(200).json(transactions);
    } catch (err) {
        console.error('Error retrieving transactions for user:', err);
        res.status(500).json({ msg: 'Internal server error', err: err });
    }
}
