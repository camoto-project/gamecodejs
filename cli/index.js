/*
 * Command line interface to the library.
 *
 * Copyright (C) 2010-2021 Adam Nielsen <malvineous@shikadi.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import fs from 'fs';
import commandLineArgs from 'command-line-args';
import {
	all as gamecodeFormats,
	decompressEXE,
	findHandler as gamecodeFindHandler,
} from '../index.js';
import Debug from '../util/debug.js';
const debug = Debug.extend('cli');

class OperationsError extends Error {
}

class Operations
{
	constructor() {
	}

	identify(params) {
		if (!params.target) {
			throw new OperationsError('identify: missing filename');
		}

		console.log('Autodetecting file format...');
		const content = {
			main: decompressEXE(fs.readFileSync(params.target)),
		};
		let handlers = gamecodeFindHandler(content.main, params.target);

		console.log(handlers.length + ' format handler(s) matched');
		if (handlers.length === 0) {
			console.log('No file format handlers were able to identify this file format, sorry.');
			return;
		}

		for (const handler of handlers) {
			const m = handler.metadata();
			console.log(`\n>> Trying handler for ${m.id} (${m.title})`);

			try {
				const suppList = handler.supps(params.target, content.main);
				if (suppList) Object.keys(suppList).forEach(id => {
					try {
						content[id] = fs.readFileSync(suppList[id]);
					} catch (e) {
						throw new Error(`Unable to open supp file ${suppList[id]}:\n     ${e}`);
					}
				});
			} catch (e) {
				console.log(` - Skipping format due to error loading additional files `
					+ `required:\n   ${e}`);
				continue;
			}

			try {
				const temp = handler.extract(content);
				console.log(` - Handler reports executable contains ${temp.length} attributes.`);
			} catch (e) {
				console.log(` - Handler failed to open file: ${e}`);
			}
		}
	}

	list() {
		for (const a of this.code.attributes) {
			console.log(`${a.id}: "${a.value}"  ${a.desc ? `// ${a.desc}` : ''}`);
		}
	}

	open(params) {
		let handler;
		if (params.format) {
			handler = gamecodeFormats.find(h => h.metadata().id === params.format);
			if (!handler) {
				throw new OperationsError('Invalid format code: ' + params.format);
			}
		}
		if (!params.target) {
			throw new OperationsError('open: missing filename');
		}

		let content = {
			main: decompressEXE(fs.readFileSync(params.target)),
		};
		if (!handler) {
			let handlers = gamecodeFindHandler(content.main, params.target);
			if (handlers.length === 0) {
				throw new OperationsError('Unable to identify this executable format.');
			}
			if (handlers.length > 1) {
				console.error('This file format could not be unambiguously identified.  It could be:');
				handlers.forEach(h => {
					const m = h.metadata();
					console.error(` * ${m.id} (${m.title})`);
				});
				throw new OperationsError('open: please use the -f option to specify the format.');
			}
			handler = handlers[0];
		}

		const suppList = handler.supps(params.target, content.main);
		if (suppList) Object.keys(suppList).forEach(id => {
			try {
				content[id] = fs.readFileSync(suppList[id]);
			} catch (e) {
				throw new OperationsError(`open: unable to open supplementary file `
					+ `"${suppList[id]}": ${e}`);
			}
		});

		this.code = handler.extract(content);
		this.origFormat = handler.metadata().id;
	}

	async save(params) {
		if (!params.target) {
			throw new OperationsError('save: missing filename');
		}
		if (!params.format) params.format = this.origFormat;

		const handler = GameArchive.getHandler(params.format);
		if (!handler) {
			throw new OperationsError('save: invalid format code: ' + params.format);
		}

		const problems = handler.checkLimits(this.archive);
		if (problems.length) {
			console.log('There are problems preventing the requested changes from taking place:\n');
			for (let i = 0; i < problems.length; i++) {
				console.log((i + 1).toString().padStart(2) + ': ' + problems[i]);
			}
			console.log('\nPlease correct these issues and try again.\n');
			throw new OperationsError('save: cannot save due to file format limitations.');
		}

		console.warn('Saving to', params.target, 'as', params.format);
		const outContent = handler.generate(this.archive);

		let promises = [];
		const suppList = handler.supps(params.target, outContent.main);
		if (suppList) Object.keys(suppList).forEach(id => {
			console.warn(' - Saving supplemental file', suppList[id]);
			promises.push(
				fs.promises.writeFile(suppList[id], outContent[id])
			);
		});
		promises.push(fs.promises.writeFile(params.target, outContent.main));

		return Promise.all(promises);
	}
}

Operations.names = {
	identify: [
		{ name: 'target', defaultOption: true },
	],
	list: [],
	open: [
		{ name: 'format', alias: 'f' },
		{ name: 'target', defaultOption: true },
	],
	save: [
		{ name: 'format', alias: 'f' },
		{ name: 'target', defaultOption: true },
	],
};

// Make some alises
const aliases = {
	list: ['dir', 'ls'],
};
Object.keys(aliases).forEach(cmd => {
	aliases[cmd].forEach(alias => {
		Operations.names[alias] = Operations.names[cmd];
		Operations.prototype[alias] = Operations.prototype[cmd];
	});
});

function listFormats()
{
	for (const handler of gamecodeFormats) {
		const md = handler.metadata();
		console.log(`${md.id}: ${md.title}`);
		if (md.params) Object.keys(md.params).forEach(p => {
			console.log(`  * ${p}: ${md.params[p]}`);
		});
	}
}

async function processCommands()
{
	let cmdDefinitions = [
		{ name: 'help', type: Boolean },
		{ name: 'formats', type: Boolean },
		{ name: 'name', defaultOption: true },
	];
	let argv = process.argv;

	let cmd = commandLineArgs(cmdDefinitions, { argv, stopAtFirstUnknown: true });
	argv = cmd._unknown || [];

	if (cmd.formats) {
		listFormats();
		return;
	}

	if (!cmd.name || cmd.help) {
		// No params, show help.
		console.log(`Use: gamecode --formats | [command1 [command2...]]

Options:

  --formats
    List all available file formats.

Commands:

  identify <file>
    Read local <file> and try to work out what executable format it is in.

  list | ls | dir
    Show all attributes in current executable.

  open [-f format] <file>
    Open the local <file> as an executable, autodetecting the format unless -f
    is given.  Use --formats for a list of possible values.

  save
    Save any changed attributes back to the previously opened executable file.

Examples:

  gamecode open cosmo1.exe list
`);
		return;
	}

	let proc = new Operations();
	//	while (argv.length > 2) {
	while (cmd.name) {
		const def = Operations.names[cmd.name];
		if (def) {
			const runOptions = commandLineArgs(def, { argv, stopAtFirstUnknown: true });
			argv = runOptions._unknown || [];
			try {
				await proc[cmd.name](runOptions);
			} catch (e) {
				if (e instanceof OperationsError) {
					console.error(e.message);
					process.exit(2);
				}
				throw e;
			}
		} else {
			console.error(`Unknown command: ${cmd.name}`);
			process.exit(1);
		}
		cmd = commandLineArgs(cmdDefinitions, { argv, stopAtFirstUnknown: true });
		argv = cmd._unknown || [];
	}
}

export default processCommands;
