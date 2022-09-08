import { Request, RequestHandler, Response } from 'express';

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

// Required in the URL (something/:PARAM/something)
export interface Params {
	[key: string]: never;
}

// At the end of the URL (?foo=bar) (ALWAYS a string!)
export interface Query {
	[key: string]: never;
}

export interface RequestResponse {
	account: AccountBase;
}

// Get my account
export const middlewares: RequestHandler[] = [ensureAuthenticated];
export default async (req: Request<Params, RequestResponse, RequestBody, Query>, res: Response<RequestResponse>) => {
	// change the type of res.json to be a RequestResponse

	const response: RequestResponse = { account: req.account.toObject() };
	return res.json(response);
};
