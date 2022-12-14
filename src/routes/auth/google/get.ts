import express from 'express';
import { Request, RequestHandler, Response } from 'express';
import path from 'path';

import passportGithub from '~/passport/github';
import passportGoogle from '~/passport/google';
import { AccountBase } from '~/types/account';
import { getMethod } from '~/types/routes';

// The types required for this route (will be shared with the Frontend automatically).
export interface RequestBody {}
export interface RequestOptions {}
export interface RequestResponse {}

// The types required for this route (Shared between the Frontend and Backend; this will make working together much easier).
export interface RequestOptions {
	params: Params;
	query: Query;
}

export interface RequestBody {
	account: AccountBase;
}

export interface Params {
	// Required in the URL (/:PARAM)
}

export interface Query {
	// At the end of the URL (?foo=bar) (ALWAYS strings!)
}

export interface RequestResponse {}

// The user is sent to here from the FE, and Passport (GitHub) will redirect them to GitHub for OAuth.
// We don't actually have to do anything here: the passport middleware will have already redirected the user.
export const middlewares: RequestHandler[] = [passportGoogle.authenticate('google', { scope: ['email profile'] })];
export default async (req: Request, res: Response) => {
	// Tell TypeScript the types of our inputs
	const body: RequestBody = req.body;
	const params: Params = req.params as unknown as Params;
	const query: Query = req.query as unknown as Query;
};
