import { getFlag, throwError } from '@lawlzer/helpers';
import { Strategy as DiscordStrategy } from '@oauth-everything/passport-discord';
import { Request } from 'express';
import passport from 'passport';

import init, { handleSocialAuth } from '~/passport/index';
import { DefaultProfile, Done } from '~/types/passport';

if (getFlag('no-social-auth')) {
	console.info('The flag "no-social-auth" was detected. We will not initialize the Discord strategy.');
} else {
	passport.use(
		// DiscordStrategy does not support "passReqToCallback" as a Type, but it still works.
		// @ts-expect-error
		new DiscordStrategy(
			{
				clientID: process.env.DISCORD_CLIENT_ID || throwError('process.env.DISCORD_CLIENT_ID is not a string'),
				clientSecret: process.env.DISCORD_CLIENT_SECRET || throwError('process.env.DISCORD_CLIENT_SECRET is not a string'),
				passReqToCallback: true,
				// callbackURL: `${config.backend.domain}/auth/discord/callback`, // https://discord.com/developers/applications
			},
			async function (req: Request, accessToken: undefined, refreshToken: string, profile: DefaultProfile, done: Done) {
				await handleSocialAuth(req, profile, 'discord', done);
			}
		)
	);
}

// serialize user into the session
init();

export default passport;
