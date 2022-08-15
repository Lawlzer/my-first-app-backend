import { Document } from 'mongoose';

export interface LoginSource {
	source: string;
	id: string;
}

export interface CustomProfile {
	id: string;
	username?: string;
	email?: string;
}

export interface DefaultProfile {
	id: string;
	username?: string;
	displayName?: string;
	email?: string;
}

export interface Done {
	(error: unknown, accountId?: string): void;
}

// For Local passport strategies, we must save the user information ourselves.
// We use this to store the user information (email + password) in the database.
//
// The LocalStrategySource is fetched using Username/Email + Password
// Then we get the Account using the loginSource 'local', with this _id
export interface LocalStrategySource extends Document {
	_id: string;

	password: string;

	createdAt: number;
}
