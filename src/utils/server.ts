import { ensureExists, objectMap } from '@lawlzer/helpers';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs-extra';
import Validator from 'validatorjs';

import config from '~/config';
import { AccountDocument } from '~/types/account';

// Express does not support async/await errors until ATLEAST v5 (which is not yet released, as of writing this). So, we will temporarily wrap all Express calls in a try/catch.
export async function errorCatcher(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		await next();
	} catch (err) {
		console.trace('Unkown error caught from errorCatcher: ', err);
		res.status(500).json({
			errors: {
				server: 'Unknown error. Please contact a developer to have us fix this! We apologize for the lack of information on this error.',
			},
		});
		if (!config.production) return;

		await ensureExists(config.paths.root + '/logs/errors');
		let existingFiles = (await fs.readdir(config.paths.root + '/logs/errors')).sort((a, b) => parseInt(a) - parseInt(b));
		if (existingFiles.length === 0) existingFiles = ['0.txt'];

		const nextFileName = String(parseInt(existingFiles[existingFiles.length - 1].split('.')[0]) + 1);
		// if (!err.stack) err.stack = 'No stack trace available';
		if (!(err instanceof Error)) {
			await fs.writeFile(config.paths.root + '/logs/errors/' + nextFileName + '.txt', 'WARNING: This error was not instanceof Error, so it does not have a stack.\n' + JSON.stringify(err));
			return;
		}
		await fs.writeFile(config.paths.root + '/logs/errors/' + nextFileName + '.txt', err.stack || '');
	}
}

export function parseValidationErrors(validation: Validator.Validator<unknown>) {
	// check if it's really a validation error
	if (!(validation instanceof Validator)) throw new Error('parseValidationErrors requires a Validator instance');
	if (!validation.fails()) throw new Error('parseValidationErrors requires a validation that fails');

	const output = objectMap(validation.errors.errors, (val, obj) => {
		return val[0];
	});
	return output;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (!req.isAuthenticated()) return res.status(401).json({ errors: { auth: 'You are not authenticated.' } });
	req.account = req.user as AccountDocument;
	return next();
}

// Encryption stuff
const INIT_VECTOR = process.env.ENCRYPTION_INIT_VECTOR;
if (typeof INIT_VECTOR !== 'string') throw new Error('process.env.ENCRYPTION_INIT_VECTOR must be a string.');
if (INIT_VECTOR.length !== 16) throw new Error('process.env.ENCRYPTION_INIT_VECTOR must be EXACTLY 16 characters long');
const SECURITY_KEY = process.env.ENCRYPTION_SECURITY_KEY;
if (typeof SECURITY_KEY !== 'string') throw new Error('process.env.ENCRYPTION_SECURITY_KEY must be a string.');
if (SECURITY_KEY.length !== 32) throw new Error('process.env.ENCRYPTION_SECURITY_KEY must be EXACTLY 32 characters long');

export function encrypt(text: string) {
	const cipher = crypto.createCipheriv('aes-256-cbc', SECURITY_KEY as string, INIT_VECTOR as string);
	let encryptedData = cipher.update(text, 'utf-8', 'hex');
	encryptedData += cipher.final('hex');
	return encryptedData;
}

export function decrypt(text: string) {
	const decipher = crypto.createDecipheriv('aes-256-cbc', SECURITY_KEY as string, INIT_VECTOR as string);
	let decryptedData = decipher.update(text, 'hex', 'utf-8');
	decryptedData += decipher.final('utf8');
	return decryptedData;
}

// Hashing stuff
const SALT_SECRET = process.env.SALT_SECRET;
const SALT_SECRET_ROUNDS = Number(process.env.SALT_SECRET_ROUNDS);
if (typeof SALT_SECRET !== 'string') throw new Error('process.env.SALT_SECRET must be a string.');
if (typeof SALT_SECRET_ROUNDS !== 'number' || isNaN(SALT_SECRET_ROUNDS)) throw new Error('process.env.SALT_SECRET_ROUNDS must be a number.');

export async function hash(input: string) {
	// Salts are stored in the encrypted text, and they should be different for each generated text -- Hence why we generate it here. (This prevents rainbow table attacks)
	return await bcrypt.hash(input, await bcrypt.genSalt(SALT_SECRET_ROUNDS));
}
export async function compareHashAndUnhashed(unhashed: string | Buffer, hashed: string) {
	return await bcrypt.compare(unhashed, hashed);
}
