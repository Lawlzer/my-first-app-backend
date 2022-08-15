// Explanation for this file is in ./index.ts

import dotenv from 'dotenv';
import fs from 'fs-extra';
import mongoose from 'mongoose';
import path from 'path';

// NODE_ENV must be set to production or development (or test, but this file shouldn't be ran with Jest)
const environmentName = process.env.NODE_ENV;
if (environmentName !== 'production' && environmentName !== 'development') throw new Error(`Unexpected process.env.NODE_ENV: ${environmentName}`);

const environmentPath = path.resolve(`.env.${environmentName}`);
if (!fs.existsSync(environmentPath)) throw new Error(`src/index.ts: Could not find environment file at ${environmentPath}`);
console.info('Using the environment: ' + environmentName);
dotenv.config({ path: environmentPath });

if (typeof process.env.MONGO_DB_ROUTE !== 'string') throw new Error('process.env.MONGO_DB_ROUTE is not a string');
mongoose.connect(process.env.MONGO_DB_ROUTE);
