import { Request, RequestHandler, Response } from 'express';

import config from '~/config';
import passportLocal from '~/passport/local';
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

function localAuthMyCallback(req: Request, res: Response, next: RequestHandler) {
	passportLocal.authenticate('local', async function (err, user, info) {
		if (err) return res.status(400).json({ error: err });
		res.redirect(config.frontend.authCallbackRoute);
	})(req, res, next);
}

// Because this is a local strategy, we have to implement the callback manually.
export const middlewares: RequestHandler[] = [localAuthMyCallback];
export default async (req: Request<Params, RequestResponse, RequestBody, Query>, res: Response<RequestResponse>) => {};
