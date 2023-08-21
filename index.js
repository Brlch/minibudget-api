import express from 'express';
import bodyParser from 'body-parser';
import transactionsRoutes from './routes/transactions.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import './config.js'; 

const app = express();


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/transactions', transactionsRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
