// Not yet implemented
// As we do not have "req", we cannot Link accounts made with email + password.

import { Request } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import init, { handleLocalStrategyAuth } from '~/passport/index';
import { Done } from '~/types/passport';

passport.use(
	'local',
	new LocalStrategy(
		{
			usernameField: 'email', // "email" is not supported by passport-local, so we have to do it this way.
			passwordField: 'password',
			// callbackURL: `${config.backend.domain}/auth/local/callback`,
			passReqToCallback: true,
		},
		async function (req: Request, email: string, password: string, done: Done) {
			if (typeof email !== 'string') return done(new Error('email is not a string'));
			if (typeof password !== 'string') return done(new Error('password is not a string'));
			await handleLocalStrategyAuth(req, email, password, done);
		}
	)
);

init();

export default passport;
