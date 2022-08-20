import fs from 'fs-extra';
import jsonStableStringify from 'json-stable-stringify';

// If we need the order of a JSON.stringify to be the same, this will guarantee the order
export function stringifyOrderGuaranteed(input: object) {
	return jsonStableStringify(input);
}
