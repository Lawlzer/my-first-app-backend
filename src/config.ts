import ms from 'ms';
import path from 'path';

const frontendDomain = 'http://127.0.0.1:3000';
const backendDomain = 'http://127.0.0.1:80';

export default {
	port: Number(process.env.PORT) || 3000,

	paths: {
		root: path.resolve(), // Path to the general "project" directory (./)
		code: path.resolve(__dirname, './'), // Path to the "code" directory (./src in this case, ./dist in production)
	},
	production: process.env.NODE_ENV === 'production', // If we are in "production" mode

	auth: {
		cookieTimeout: ms('1d') * 7, // The amount of MS an account will be valid for (time until logout)
		accountLinkTimeoutSeconds: 30 * 60, // How long an "account link" code will be valid for.
	},
	backend: {
		domain: backendDomain,
	},
	frontend: {
		domain: frontendDomain,
		homepage: `${frontendDomain}`,
		loginRoute: `${frontendDomain}/pls-login`,
		authCallbackRoute: `${frontendDomain}/home`,
	},
};
