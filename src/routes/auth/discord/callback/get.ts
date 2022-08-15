import express from 'express';
import { Request, RequestHandler, Response } from 'express';
import path from 'path';

import config from '~/config';
import passportDiscord from '~/passport/discord';
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

// Discord will redirect us to this page -> we redirect the user back to the auth-callback route.
export const middlewares: RequestHandler[] = [passportDiscord.authenticate('discord', { failureRedirect: config.frontend.loginRoute })];
export default async (req: Request, res: Response) => {
	// Tell TypeScript the types of our inputs
	const body: RequestBody = req.body;
	const params: Params = req.params as unknown as Params;
	const query: Query = req.query as unknown as Query;

	res.redirect(config.frontend.authCallbackRoute);
};
