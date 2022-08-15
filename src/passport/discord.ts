import { Strategy as DiscordStrategy } from '@oauth-everything/passport-discord';
import { Request } from 'express';
import passport from 'passport';

import init, { handleSocialAuth } from '~/passport/index';
import { DefaultProfile, Done } from '~/types/passport';

if (typeof process.env.DISCORD_CLIENT_ID !== 'string') throw new Error('DISCORD_CLIENT_ID is not defined');
if (typeof process.env.DISCORD_CLIENT_SECRET !== 'string') throw new Error('DISCORD_CLIENT_SECRET is not defined');
passport.use(
	// DiscordStrategy does not support "passReqToCallback" as a Type, but it still works.
	// @ts-expect-error
	new DiscordStrategy(
		{
			clientID: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			passReqToCallback: true,
			// callbackURL: `${config.backend.domain}/auth/discord/callback`, // https://discord.com/developers/applications
		},
		async function (req: Request, accessToken: undefined, refreshToken: string, profile: DefaultProfile, done: Done) {
			await handleSocialAuth(req, profile, 'discord', done);
		}
	)
);

// serialize user into the session
init();

export default passport;
