import { getAllFiles } from '@lawlzer/helpers';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import session from 'express-session'; // Swap to cookie-session once it's updated (from MongoStore)
import slowDown from 'express-slow-down';
import mongoose from 'mongoose';
import morgan from 'morgan';
import ms from 'ms';
import passport from 'passport';
import path from 'path';

import config from '~/config';
import {} from '~/types/account';
import {} from '~/types/index';
import {} from '~/types/passport';
import { getMethod } from '~/types/routes';
import { errorCatcher } from '~/utils/server';
const app = express();
const router = express.Router();
app.use((req, res, next) => {
	req.receivedAt = Date.now();
	next();
});

app.use(cookieParser()); // Allow us to use cookies

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (typeof mongoose?.connection === 'undefined') throw new Error('mongoose.connection is undefined');
// Passport initialization
if (typeof process.env.SESSION_SECRET !== 'string') throw new Error('process.env.SESSION_SECRET is not a string');
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: config.auth.cookieTimeout },
		store: new MongoStore({
			client: mongoose.connection.getClient(),
			crypto: {
				secret: process.env.SESSION_SECRET,
			},
			ttl: config.auth.cookieTimeout,
		}),
	})
);

app.use(passport.initialize()); // Give Passport access to "express-session"
app.use(passport.session()); // Force Passport to use the session

// app.enable('trust proxy');  // Should be used if you are behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

// Slow down users who make a lot of requests
const speedLimiter = slowDown({
	windowMs: ms('1h'), // Every 60 minutes, reset
	delayAfter: 1000, // allow 1000 requests per windowMS
	delayMs: 500, // begin adding 500ms of delay per request above delayAfter
});
app.use(speedLimiter);

// Give us pretty logs <3
app.use(morgan('tiny')); // or: combined

app.use(cors({ origin: true, credentials: true }));

// Import every route recursively
(async () => {
	const allRoutes = await getAllFiles(path.join(config.paths.code, 'routes'));
	let badExtensions = ['.map', '.d.ts', '.test.ts'];

	for (const filePath of allRoutes) {
		if (badExtensions.some((extension) => filePath.endsWith(extension))) {
			console.info('Skipping automatically importing the file: ', filePath);
			continue;
		}

		// Get the path to the file, from "/routes" to the end, not including the file extension.
		let routePath = filePath
			.replaceAll('\\', '/')
			.substring(filePath.indexOf('routes') + 'routes'.length + 1)
			.split('/');
		routePath.pop();

		// If a folder contains [text], replace it with a :param
		const finalRoutePath = routePath
			.map((singleFolder) => {
				if (singleFolder.includes('[') && singleFolder.includes(']')) return singleFolder.replace('[', ':').replace(']', '');

				return singleFolder;
			})
			.join('/');

		try {
			// If we import the route in the file itself, we won't have Query params, as it won't be passed to the Router, unless we explicitly export it.
			// Instead, we import every file here (Each file will only have ONE route, as we are going with the NextJS style routes).
			const routerModule = await import(filePath); // Same as app.use(require(filepath))

			const method = getMethod(filePath);

			router[method](`/${finalRoutePath}`, [...routerModule.middlewares], async (req: Request, res: Response) => {
				await errorCatcher(req, res, async () => {
					await routerModule.default(req, res);
				});
			});

			app.use(`/`, router);
		} catch (e) {
			console.log('run_server.ts, e: ', e);
			console.info('We crashed attempting to import a file.  We probably forgot a module.exports at the bottom:\n' + filePath);
			process.exit();
		}
	}
})();

export default app; // Because we cannot app.listen() with Jest, we will export the app (imported in index.ts), and listen there.
