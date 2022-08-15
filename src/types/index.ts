import { AccountDocument } from '~/types/account';

declare global {
	namespace Express {
		interface Request {
			receivedAt: number;
			account: AccountDocument;
			// User: DatabaseAccount; // Was not working at all, so now we just use req.account
		}
		// type User = DatabaseAccount;
	}
	// set the global env
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production' | 'test';
	}
}
