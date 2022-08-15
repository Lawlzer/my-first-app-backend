// Documentation explained in src/types/passport.ts -> LocalStrategySource
import { returnRandomCharacters } from '@lawlzer/helpers';
import mongoose from 'mongoose';
import mongooseEncryption from 'mongoose-encryption';

import { LocalStrategySource } from '~/types/passport';

const LocalStrategySourceSchema = new mongoose.Schema<LocalStrategySource>({
	_id: { type: String, default: () => returnRandomCharacters(50, { symbols: false }) }, // normally _id is an ObjectId, but that's a pain to work with - so we replace it with a random String

	password: { type: String, required: true },

	createdAt: { type: Number, default: () => Date.now() },
});

const MONGOOSE_ENCRYPTION_SECRET = process.env.MONGOOSE_ENCRYPTION_SECRET;
if (typeof MONGOOSE_ENCRYPTION_SECRET !== 'string') throw new Error('process.env.MONGOOSE_ENCRYPTION_SECRET is not a string');
LocalStrategySourceSchema.plugin(mongooseEncryption, { secret: MONGOOSE_ENCRYPTION_SECRET, excludeFromEncryption: ['_id', 'createdAt'] });

export default mongoose.model('LocalStrategySource', LocalStrategySourceSchema);
