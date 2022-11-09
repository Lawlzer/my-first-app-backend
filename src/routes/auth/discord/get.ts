import { Request, RequestHandler, Response } from 'express';

import passportDiscord from '~/passport/discord';
import { AccountBase } from '~/types/account';

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
	[key: string]: never;
}

// The user is sent to here from the FE, and Passport (Discord) will redirect them to Discord for OAuth.
export const middlewares: RequestHandler[] = [passportDiscord.authenticate('discord', {})];
export default async (req: Request<Params, RequestResponse, RequestBody, Query>, res: Response<RequestResponse>) => {
	// the Passport middleware will have already redirected the user
	return;
};
