import express from 'express';
import bodyParser from 'body-parser';
import transactionsRoutes from './routes/transactions.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import swaggerDocument from './docs/swagger/swagger-output.json' assert { type: "json" };
import swaggerUi from 'swagger-ui-express';

import './config.js'; 

const app = express();


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/transactions', transactionsRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

// Api Documentation (Swagger)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
