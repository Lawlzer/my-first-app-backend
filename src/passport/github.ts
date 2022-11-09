import { getFlag, throwError } from '@lawlzer/helpers';
import { Request } from 'express';
import passport from 'passport';
import PassportGithub from 'passport-github2';

import config from '~/config';
import init, { handleSocialAuth } from '~/passport/index';
import { Done } from '~/types/passport';

const GithubStrategy = PassportGithub.Strategy;

if (getFlag('no-social-auth')) {
	console.info('The flag "no-social-auth" was detected. We will not initialize the GitHub strategy.');
} else {
	passport.use(
		new GithubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID || throwError('process.env.GITHUB_CLIENT_ID is not a string'),
				clientSecret: process.env.GITHUB_CLIENT_SECRET || throwError('process.env.GITHUB_CLIENT_SECRET is not a string'),
				callbackURL: `${config.backend.domain}/auth/github/callback`,
				passReqToCallback: true,
			},
			async function (req: Request, accessToken: string, refreshToken: undefined | unknown, profile: PassportGithub.Profile, done: Done) {
				await handleSocialAuth(req, profile, 'github', done);
			}
		)
	);
}
// serialize user into the session
init();

export default passport;
