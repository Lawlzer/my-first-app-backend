import { Request, RequestHandler, Response } from 'express';

import { ensureAuthenticated } from '~/utils/server';

// The types required for this route (Shared between the Frontend and Backend; this will make working together much easier).
export interface RequestOptions {
	params: Params;
	query: Query;
}

export interface RequestBody {
	[key: string]: never;
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

// Delete my account
export const middlewares: RequestHandler[] = [ensureAuthenticated];
export default async (req: Request<Params, RequestResponse, RequestBody, Query>, res: Response<RequestResponse>) => {
	await req.account.delete();
	return res.status(204);
};
