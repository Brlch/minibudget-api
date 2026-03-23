import express from 'express';
import bodyParser from 'body-parser';
import transactionsRoutes from './routes/transactions.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import testProtectedRoutes from './routes/testProtected.js';

import './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, './docs/swagger/swagger-output.json'),
    'utf8'
  )
);

const app = express();

const allowedOrigins = new Set([
  'http://api.myminibudget.com',
  'https://api.myminibudget.com',
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:19006',
  'http://127.0.0.1:19006'
]);

const extraOrigins = process.env.CORS_ORIGINS
  ?.split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

extraOrigins?.forEach(origin => allowedOrigins.add(origin));

const corsOptions = {
  origin(origin, callback) {
    if (allowedOrigins.has(origin) || !origin) {
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

// Higher limits keep import and sync payloads from getting rejected in dev.
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));

app.use('/transactions', transactionsRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/test', testProtectedRoutes);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
