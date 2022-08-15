import { getAllFiles } from '@lawlzer/helpers';
import fs from 'fs-extra';
import path from 'path';
const fsPromises = fs.promises;
const pathToRoutes = path.resolve(__dirname, 'src', 'routes');
let requiredInterfaces = ['RequestOptions', 'RequestBody', 'RequestResponse'];

async function getInterfaces(filepath: string, importantInterfaces: string[]) {
	const file = await import(filepath);
	const content = await fsPromises.readFile(filepath, 'utf8');
	console.log('content: ', content);
}

(async () => {
	// const allRoutes = await getAllFiles(pathToRoutes);
	// console.log('allRoutes: ', allRoutes);

	const route = 'C:\\Code\\Fullstack\\my-first-app\\my-first-app-backend\\src\\routes\\account\\myAccount\\delete.ts';

	const fileContent = await getInterfaces(route, ['Request', 'RequestHandler', 'Response']);
})();
