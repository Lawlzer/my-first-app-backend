import { Request } from 'express';
import passport from 'passport';
import PassportGithub from 'passport-github2';

import config from '~/config';
import init, { handleSocialAuth } from '~/passport/index';
import { Done } from '~/types/passport';

const GithubStrategy = PassportGithub.Strategy;

if (typeof process.env.GITHUB_CLIENT_ID !== 'string') throw new Error('GITHUB_CLIENT_ID is not defined');
if (typeof process.env.GITHUB_CLIENT_SECRET !== 'string') throw new Error('GITHUB_CLIENT_SECRET is not defined');
passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: `${config.backend.domain}/auth/github/callback`,
			passReqToCallback: true,
		},
		async function (req: Request, accessToken: string, refreshToken: undefined | unknown, profile: PassportGithub.Profile, done: Done) {
			await handleSocialAuth(req, profile, 'github', done);
		}
	)
);

// serialize user into the session
init();

export default passport;
