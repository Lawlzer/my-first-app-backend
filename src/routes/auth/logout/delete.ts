import { Request, RequestHandler, Response } from 'express';

import config from '~/config';
import { AccountBase } from '~/types/account';
import { ensureAuthenticated } from '~/utils/server';

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

// Get my account
export const middlewares: RequestHandler[] = [ensureAuthenticated];
export default async (req: Request, res: Response) => {
	// Tell TypeScript the types of our inputs
	const body: RequestBody = req.body;
	const params: Params = req.params as unknown as Params;
	const query: Query = req.query as unknown as Query;

	// req.session = null;

	req.logout({ keepSessionInfo: false }, () => {});
	res.redirect(config.frontend.loginRoute);
	return res.status(201);
};
