// Explanation for this file is in ./index.ts

import { initDotenv } from '@lawlzer/helpers';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import mongoose from 'mongoose';
import path from 'path';

initDotenv();

if (typeof process.env.MONGO_URI !== 'string' || typeof process.env.MONGO_DATABASE !== 'string') throw new Error('process.env.MONGO_URI || process.env.MONGO_DATABASE is not a string');
mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DATABASE}`);
