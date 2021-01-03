/*
 * Simple list of offsets and property types for executable handlers.
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

import Debug from '../util/debug.js';
const debug = Debug.extend('CodeHandler_Simple');

import pkgRecordIOBuffer from '@malvineous/record-io-buffer';
const { RecordBuffer, RecordType } = pkgRecordIOBuffer;
import CodeHandler from './CodeHandler.js';

function attrType(a) {
	switch (a.type) {
		case 'stringz':
			return RecordType.string.fixed.reqTerm(a.len);
	}

	throw new Error(`Unknown attribute data type "${a.type}".`);
}

export default class CodeHandler_Simple extends CodeHandler
{
	static attributes() {
		throw new Error('BUG: This format handler hasn\'t implemented attributes()!');
	}

	static identifyBySignature(content, offset, expected) {
		let buffer = new RecordBuffer(content);
		const sig = buffer.getU8(offset, expected.length);
		for (let i = 0; i < expected.length; i++) {
			if (sig[i] !== expected[i]) {
				return {
					valid: false,
					reason: `Signature mismatch at offset 0x${offset.toString(16)}, `
						+ `index ${i} (expected 0x${expected[i].toString(16)}, got `
						+ `0x${sig[i].toString(16)}).`,
				};
			}
		}

		return {
			valid: true,
		};
	}

	static extract({main: content}) {
		const ats = this.attributes();

		let buffer = new RecordBuffer(content);

		let attributes = {};
		for (const a of ats) {
			if (a.offset !== undefined) {
				buffer.seekAbs(a.offset);
			}
			const recordType = attrType(a);
			const value = buffer.read(recordType);

			attributes[a.id] = {
				...a,
				value,
			};
			//delete attributes[a.id].id;
		}

		return {
			attributes,
		};
	}

	static patch({main: content}, exe) {
		let buffer = new RecordBuffer(content);

		for (const idAttr of Object.keys(exe.attributes)) {
			const a = exe.attributes[idAttr];

			if (a.offset !== undefined) {
				buffer.seekAbs(a.offset);
			}

			const recordType = attrType(a);
			buffer.write(recordType, a.value);
		}

		return {
			main: buffer.getU8(),
		};
	}
}
