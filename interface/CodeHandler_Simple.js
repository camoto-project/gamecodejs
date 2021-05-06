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

import { RecordBuffer } from '@camoto/record-io-buffer';
import CodeHandler from './CodeHandler.js';

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
			let value;
			try {
				value = buffer.read(a.type);
			} catch (e) {
				console.error(e);
				throw new Error(`Error reading field ${a.id}: ${e.message}`);
			}

			if (a.valueOffset) value += a.valueOffset;

			if (attributes[a.id]) {
				throw Error(`BUG: File format declared multiple items with the ID "${a.id}".`);
			}

			attributes[a.id] = {
				...a,
				value,
			};
			//delete attributes[a.id].id;
			delete attributes[a.id].valueOffset;
		}

		return {
			attributes,
		};
	}

	static patch({main: content}, exe) {
		const ats = this.attributes();
		let buffer = new RecordBuffer(content);

		for (const a of ats) {
			if (a.offset !== undefined) {
				buffer.seekAbs(a.offset);
			}

			if (exe.attributes[a.id]) {
				let targetValue = exe.attributes[a.id].value;
				if (a.valueOffset) targetValue -= a.valueOffset;

				buffer.write(a.type, targetValue);
			} else {
				// Value omitted, skip over the field.
				debug(`Missing value for ${a.id}`);
				buffer.seekRel(a.type.len);
			}
		}

		return {
			main: buffer.getU8(),
		};
	}
}
