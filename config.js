import dotenv from 'dotenv';
import { validateRuntimeEnv } from './config/env.js';
dotenv.config();

validateRuntimeEnv(process.env);
