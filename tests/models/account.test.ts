// todo test realtime
// todo move tests to place
// todo test types

import mongoose from 'mongoose';

import Account from '~/models/account';

import { clearMongoose, initMongoose } from '../mongooseHandler';
describe('Account', () => {
	beforeEach(async () => {
		await initMongoose();
	});
	afterEach(async () => {
		await clearMongoose();
	});

	it('is able to be created & fetched', async () => {
		const account = await Account.create({ email: 'kevindaspam@gmail.com' });
		expect(account).toBeDefined();
		expect(account.email).toBe('kevindaspam@gmail.com');

		const fetchedAccount = await Account.findOne({ email: 'kevindaspam@gmail.com' });
		expect(fetchedAccount).toBeTruthy();
		expect(fetchedAccount!.email).toBe('kevindaspam@gmail.com');
	});

	it('is encrypted', async () => {
		const account = await Account.create({ username: 'Lawlzer', email: 'kevindaspam@gmail.com' });
		expect(account).toBeDefined();
		expect(account.username).toBe('Lawlzer');

		// We have to bypass the encryption plugin, to ensure it's actually encrypted.
		const db = mongoose.connection.db;
		const collection = db.collection('accounts');
		const encryptedAccount = await collection.findOne({ _id: account._id });
		expect(encryptedAccount).toBeTruthy();
		expect(encryptedAccount!.username).toBeFalsy(); // We don't even get the username if it's encrypted, and bypassed..
		// expect(account.username).not.toBe(encryptedAccount!.username); // If we actually got the username, this is how we'd check.
	});

	// Ideally, we would check if the hashing works post-server reset, but I'm not sure if that's possible with Jest.
});
