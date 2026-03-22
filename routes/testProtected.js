import express from 'express';
import authenticateJWT from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/protected', authenticateJWT, (req, res) => {
  res.status(200).json({
    message: 'Access granted',
    userId: req.user.id
  });
});

export default router;
