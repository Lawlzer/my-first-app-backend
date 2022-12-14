// Jest does not allow us to use dotenv, mongoose, or app.listen() in tests -- So we move the general server code to ./run_server.ts, and run initialization code (dotenv, mongoose, app.listen()) here.
// Additionally, Babel ignores the order of "imports", and will run files that require process.env first, BEFORE running this file.
// So, we must move dotenv imports (and Mongo) there, which is ran FIRST.
import '~/initEverything';

// Imports used to be here, but they moved to ~/initEverything
import config from '~/config'; // If we import config at the very top, we won't have injected the .env variables first.
// run_server creates the app, but does not app.listen() -- So we listen here. If we listened in run_server, Jest wouldn't work properly.
import app from '~/run_server';
// If we add a hostname, Docker will hate you.
app.listen(config.port, () => {
	console.info(`Server started on port ${config.port}`);
});
export {};
