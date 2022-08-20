import Validator from 'validatorjs';

import { compareHashAndUnhashed, decrypt, encrypt, hash, parseValidationErrors } from '~/utils/server';

describe('encrypt & decrypt', () => {
	it('will encrypt a string', async () => {
		const encrypted = encrypt('test');
		expect(encrypted).toBeTruthy();
		expect(encrypted).not.toBe('test');
	});

	it('will decrypt a string', async () => {
		const encrypted = encrypt('test');
		const decrypted = decrypt(encrypted);
		expect(decrypted).toBe('test');
	});
});

describe('hash & compareHashAndUnhashed', () => {
	it('will hash a string', async () => {
		const hashed = await hash('test');
		expect(hashed).toBeTruthy();
		expect(hashed).not.toBe('test');
	});

	it('will compare a string to a hash', async () => {
		const hashed = await hash('test');
		const isValid = await compareHashAndUnhashed('test', hashed);
		console.log('isValid: ', isValid);
		expect(isValid).toBeTruthy();
	});

	it('will return false when compared to the wrong string', async () => {
		const hashed = await hash('test');
		const isValid = await compareHashAndUnhashed('test2', hashed);
		expect(isValid).toBeFalsy();
	});

	it('will hash the same thing differently', async () => {
		const hashed1 = await hash('test');
		const hashed2 = await hash('test');
		expect(hashed1).not.toBe(hashed2);
	});
	// Ideally, we would check if the hashing works post-server reset, but I'm not sure if that's possible with Jest.
});

describe('parseValidationErrors', () => {
	it('will throw an error if it tries to parse a valid email', async () => {
		const input = { email: 'kevindaspam@gmail.com' };
		const validation = new Validator(input, {
			email: 'required|string|email',
		});
		expect(() => parseValidationErrors(validation)).toThrow();
	});

	it('will parse an Email validation error', async () => {
		const input = { email: 'test' };
		const validation = new Validator(input, {
			email: 'required|string|email',
		});
		const result = parseValidationErrors(validation);
		expect(result).toEqual({ email: 'The email format is invalid.' });
	});
});
