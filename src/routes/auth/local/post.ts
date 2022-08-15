import { Request, RequestHandler, Response } from 'express';

import config from '~/config';
import passportLocal from '~/passport/local';
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

function localAuthMyCallback(req: Request, res: Response, next: RequestHandler) {
	// Tell TypeScript the types of our inputs
	const body: RequestBody = req.body;
	const params: Params = req.params as unknown as Params;
	const query: Query = req.query as unknown as Query;

	passportLocal.authenticate('local', async function (err, user, info) {
		if (err) return res.status(400).json({ error: err });
		res.redirect(config.frontend.authCallbackRoute);
	})(req, res, next);
}

// Because this is a local strategy, we have to implement the callback manually.
export const middlewares: RequestHandler[] = [localAuthMyCallback];
export default async (req: Request, res: Response) => {};
