import { Document } from 'mongoose';

import { LoginSource } from '~/types/passport';

export interface Token {
	_id: string;
	myAccountId: string;

	createdAtDate: Date;
}

// The simple account, users are allowed to see this (it's sent to the FE)
export interface AccountBase {
	username: string;
	email: string;
	loginSources: LoginSource[];

	createdAt: number;
}

// The Account that the database uses; has access to every property of the BaseAccount
export interface AccountDocument extends AccountBase, Document {
	_id: string;
}
