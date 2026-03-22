import db from '../models/index.js';
import { Op } from 'sequelize';

const { Transaction } = db;

export async function getAllTransactions(req, res) {
    try {
        const transactions = await Transaction.findAll({
          where: { userId: req.user.id },
        });
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
        const transaction = await Transaction.findOne({
          where: {
            id: req.params.id,
            userId: req.user.id,
          },
        });

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
          where: {
            id: req.params.id,
            userId: req.user.id,
          },
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
          where: {
            id: req.params.id,
            userId: req.user.id,
          },
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

        if (Number(req.params.userId) !== req.user.id) {
          return res.status(403).json({ error: 'Forbidden' });
        }

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

export const getTransactionsSince = async (req, res) => {
const since = new Date(req.params.timestamp);

if (isNaN(since.getTime())) {
    return res.status(400).json({ error: 'Invalid timestamp' });
}

const transactions = await Transaction.findAll({
    where: {
        userId: req.user.id,
        [Op.or]: [
            { updatedAt: { [Op.gte]: since } },
            { deletedAt: { [Op.gte]: since } },
        ],
        },
    paranoid: false,
    order: [['updatedAt', 'ASC']],
});

res.json({
    transactions,
    serverTime: new Date().toISOString(),
});
};

export const syncTransactions = async (req, res) => {
  const { transactions = [] } = req.body;

  const created = [];
  const updated = [];
  const deleted = [];
  const conflicts = [];

  const userId = req.user.id;

  // Helper: check if an ID is a valid numeric DB id
  const isNumericId = v =>
    typeof v === 'number' ||
    (typeof v === 'string' && /^\d+$/.test(v));

  for (const tx of transactions) {
    /* ----------------------------------
     * DELETE (only if server ID exists)
     * ---------------------------------- */
    if (tx.deletedAt && isNumericId(tx.id)) {
      const count = await Transaction.destroy({
        where: {
          id: Number(tx.id),
          userId,
        },
      });

      if (count > 0) {
        deleted.push(tx.id);
      }

      continue;
    }

    /* ----------------------------------
     * UPDATE (only numeric IDs)
     * ---------------------------------- */
    if (isNumericId(tx.id)) {
      const serverTx = await Transaction.findOne({
        where: {
          id: Number(tx.id),
          userId,
        },
        paranoid: false,
      });

      if (!serverTx) {
        continue;
      }

      // Conflict detection (server wins)
      if (
        tx.updatedAt &&
        new Date(tx.updatedAt) < new Date(serverTx.updatedAt)
      ) {
        conflicts.push(tx.id);
        continue;
      }

      const [count] = await Transaction.update(
        {
          date: tx.date,
          amount: tx.amount,
          type: tx.type,
          category: tx.category,
          description: tx.description,
          deletedAt: tx.deletedAt ?? null,
        },
        {
          where: {
            id: Number(tx.id),
            userId,
          },
          paranoid: false,
        }
      );

      if (count > 0) {
        updated.push(tx.id);
      }

      continue;
    }

    /* ----------------------------------
     * CREATE (client-only IDs)
     * ---------------------------------- */
    const createdTx = await Transaction.create({
      date: tx.date,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      description: tx.description,
      userId,
    });

    created.push({
      clientId: tx.id ?? tx.clientId,
      id: createdTx.id,
    });
  }

  res.json({
    created,
    updated,
    deleted,
    conflicts,
  });
};
