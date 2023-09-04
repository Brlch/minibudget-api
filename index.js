import express from 'express';
import bodyParser from 'body-parser';
import transactionsRoutes from './routes/transactions.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import swaggerDocument from './docs/swagger/swagger-output.json' assert { type: "json" };
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import './config.js'; 

const app = express();

// CORS Configuration
const allowedOrigins = ['http://api.myminibudget.com', 'https://api.myminibudget.com'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) { // allows localhost and defined origins
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

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
