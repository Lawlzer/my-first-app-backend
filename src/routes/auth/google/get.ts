import { Request, RequestHandler, Response } from 'express';

import passportGoogle from '~/passport/google';
import { AccountBase } from '~/types/account';

// The types required for this route (Shared between the Frontend and Backend; this will make working together much easier).
export interface RequestOptions {
	params: Params;
	query: Query;
}

export interface RequestBody {
	account: AccountBase;
}

// Required in the URL (/:PARAM)
export interface Params {
	[key: string]: never;
}

// At the end of the URL (?foo=bar) (ALWAYS strings!)
export interface Query {
	[key: string]: never;
}

export interface RequestResponse {
	[key: string]: never;
}

// The user is sent to here from the FE, and Passport (GitHub) will redirect them to GitHub for OAuth.
// We don't actually have to do anything here: the passport middleware will have already redirected the user.
export const middlewares: RequestHandler[] = [passportGoogle.authenticate('google', { scope: ['email profile'] })];
export default async (req: Request, res: Response) => {
	// Tell TypeScript the types of our inputs
	const body: RequestBody = req.body;
	const params: Params = req.params as unknown as Params;
	const query: Query = req.query as unknown as Query;
};
