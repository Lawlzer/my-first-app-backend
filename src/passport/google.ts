import passport from 'passport';
import passportGoogleOauth from 'passport-google-oauth';

import config from '~/config';
import init, { handleSocialAuth } from '~/passport/index';

const GoogleStrategy = passportGoogleOauth.OAuth2Strategy;

if (typeof process.env.GOOGLE_CLIENT_ID !== 'string') throw new Error('process.env.GOOGLE_CLIENT_ID is not a string');
if (typeof process.env.GOOGLE_CLIENT_SECRET !== 'string') throw new Error('process.env.GOOGLE_CLIENT_SECRET is not a string');

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${config.backend.domain}/auth/google/callback`,
			passReqToCallback: true,
		},
		async function (req, accessToken, refreshToken, profile, done) {
			await handleSocialAuth(req, profile, 'google', done);
		}
	)
);

init();

export default passport;
