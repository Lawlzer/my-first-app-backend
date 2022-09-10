import { getRandomCharacters } from '@lawlzer/helpers';
import mongoose from 'mongoose';
import mongooseEncryption from 'mongoose-encryption';

import { AccountDocument } from '~/types/account';

const AccountSchema = new mongoose.Schema<AccountDocument>({
	_id: { type: String, default: () => getRandomCharacters(50, { upperCase: true, lowerCase: true, symbols: true, numbers: true }) }, // normally _id is an ObjectId, but that's a pain to work with - so we replace it with a random String

	// When creating an account with Passport, sometimes the information can be weird.  If we're not given the information from Passport, the user will be redirected
	// to finish their account creation.
	username: { type: String, required: false }, // Same as under, we will not absolutely require it.
	email: { type: String, required: false }, // Sometimes, the user will not have an email (e.g Github).

	// We use an array of objects, because it's more easier (more modular) to add new login sources in the future.
	loginSources: [
		{
			source: { type: String, required: true },
			id: { type: String, required: true },
		},
	],

	createdAt: { type: Number, default: () => Date.now() },
});

// Automatically encrypt <some> fields.
const MONGOOSE_ENCRYPTION_SECRET = process.env.MONGOOSE_ENCRYPTION_SECRET;
if (typeof MONGOOSE_ENCRYPTION_SECRET !== 'string') throw new Error('process.env.MONGOOSE_ENCRYPTION_SECRET is not a string');
AccountSchema.plugin(mongooseEncryption, { secret: MONGOOSE_ENCRYPTION_SECRET, excludeFromEncryption: ['_id', 'createdAt', 'email', 'loginSources'] });

// Create the indexes
AccountSchema.index({ 'loginSources.source': 1, 'loginSources.id': 1 }, { collation: { locale: 'en', strength: 1 } });

export default mongoose.model('Account', AccountSchema);
