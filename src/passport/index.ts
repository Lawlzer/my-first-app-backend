import { } from '@lawlzer/helpers';
import { Request } from 'express';
import passport from 'passport';

import Account from '~/models/account';
import LocalStrategySource from '~/models/localStrategySource';
import { AccountDocument } from '~/types/account';
import { CustomProfile, DefaultProfile, Done, LoginSource } from '~/types/passport';
import { compareHashAndUnhashed, hash } from '~/utils/server';

export default function () {
	passport.serializeUser(function (accountId, done) {
		done(null, accountId);
	});

	passport.deserializeUser(async function (accountId, done) {
		if (typeof accountId !== 'string') return done(new Error('accountId is not a string'));
		const account = await Account.findOne({ _id: accountId });
		done(null, account);
	});
}

// Update the most recent login source, so we know where the user is logged in from.
async function updateLoginSource(account: AccountDocument, inputLoginSource: LoginSource) {
	let loginSource = account.loginSources.find((source) => source.source === inputLoginSource.source && source.id === inputLoginSource.id);
	if (!loginSource) {
		loginSource = inputLoginSource;
		account.loginSources.push(loginSource);
	}

	await account.save();
	return account;
}

// This handles everything for social authentication (e.g. Discord, Google, etc.)
// Passport handles all of the auth stuff for us, so we know the user is verified. All we need to do is find their account.
export async function handleSocialAuth(req: Request, initialProfile: DefaultProfile, source: string, done: Done) {
	const customProfile: CustomProfile = {
		id: initialProfile.id,
		username: initialProfile.username || initialProfile.displayName || undefined,
		email: initialProfile.email || undefined, // GitHub does not give us the email
	};

	const loginSource: LoginSource = {
		source: source,
		id: customProfile.id,
	};

	// First, check if the account using the correct login source exists
	let account: AccountDocument | null = await Account.findOne({ loginSources: { $elemMatch: { source: loginSource.source, id: loginSource.id } } });

	// // Secondly, check if an account with the same email exists
	// // This check is currently disabled, but could easily be enabled, if we want users to auto-linked, if they have the same email.
	// // However, this could cause problems if the user changes their email, AND there are security issues -- E.g if Discord allowed a user to create an account without the email being verified, this would easily be hackable.
	// // if (!account && customProfile.email) account = await Account.findOne({ email: customProfile.email });

	// We need to make a new account -- If the user is already "logged in" (has a req.user), then they're simply trying to link their account.
	if (!account && req.user && req.isAuthenticated()) {
		account = req.user as AccountDocument;
		console.log('Account auto-merged!');
	}

	// Thirdly, just create the account.
	if (!account) account = await Account.create({ email: customProfile.email });

	// Update the account with the new login source
	await updateLoginSource(account, loginSource);

	// Tell Passport to save the account._id in the session
	await done(null, account._id);
}

// Same as above, except this is specifically for local login. (Email + Password)
// For local auth, we have to handle the passwords ourselves.
export async function handleLocalStrategyAuth(req: Request, email: string, password: string, done: Done) {
	await LocalStrategySource.deleteMany({});
	const localSource = await LocalStrategySource.findOne({ email: email });
	// The source doesn't exist, so we must create it + an account for the user.
	if (!localSource) {
		const account = await Account.create({ email: email });
		const newSource = await LocalStrategySource.create({ email: email, accountId: account._id, password: await hash(password) });
		await updateLoginSource(account, { source: 'local', id: newSource._id });
		return done(null, account._id);
	}

	// This source exists, we just need to check if the password is correct.
	const correctPassword = await compareHashAndUnhashed(password, localSource.password);
	if (!correctPassword) return done(new Error('Incorrect password'));

	// The user is now successfully verified, so we can call handleSocialAuth to find their account.
	const tempSource: DefaultProfile = {
		id: localSource._id,
		email: email,
	};
	return await handleSocialAuth(req, tempSource, 'local', done);
}
