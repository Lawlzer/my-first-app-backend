import { Request, RequestHandler, Response } from 'express';

import config from '~/config';
import passportDiscord from '~/passport/discord';

// The types required for this route (Shared between the Frontend and Backend; this will make working together much easier).
export interface RequestOptions {
	params: Params;
	query: Query;
}

export interface RequestBody {
	[key: string]: never;
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

// Discord will redirect us to this page -> we redirect the user back to the auth-callback route.
export const middlewares: RequestHandler[] = [passportDiscord.authenticate('discord', { failureRedirect: config.frontend.loginRoute })];
export default async (req: Request<Params, RequestResponse, RequestBody, Query>, res: Response<RequestResponse>) => {
	res.redirect(config.frontend.authCallbackRoute);
};
