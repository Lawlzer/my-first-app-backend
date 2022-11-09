// This is effectively a type guard, it takes an unknown string (file name) and returns the method, if it's allowed. (Used for determining the method for a given file/route, based on the file name)
const allowedMethods = <const>['get', 'post', 'put', 'delete'];
export type Method = typeof allowedMethods[number];

// We have to use any here, because "string" won't work in the other files.
export function getMethod(filePath: any) {
	const method = filePath.replaceAll('\\', '/').split('/').pop().split('.')[0] as Method;

	if (!allowedMethods.includes(method)) throw new Error(`${method} is not a valid method.  It's been used as a filename, but it's not a legal method.`);
	return method as Method;
}
