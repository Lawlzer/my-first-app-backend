import { getFlag, throwError } from '@lawlzer/helpers';
import passport from 'passport';
import passportGoogleOauth from 'passport-google-oauth';

import config from '~/config';
import init, { handleSocialAuth } from '~/passport/index';

const GoogleStrategy = passportGoogleOauth.OAuth2Strategy;
if (getFlag('no-social-auth')) {
	console.info('The flag "no-social-auth" was detected. We will not initialize the Google strategy.');
} else {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID || throwError('process.env.GOOGLE_CLIENT_ID is not a string'),
				clientSecret: process.env.GOOGLE_CLIENT_SECRET || throwError('process.env.GOOGLE_CLIENT_SECRET is not a string'),
				callbackURL: `${config.backend.domain}/auth/google/callback`,
				passReqToCallback: true,
			},
			async function (req, accessToken, refreshToken, profile, done) {
				await handleSocialAuth(req, profile, 'google', done);
			}
		)
	);
}

init();

export default passport;
