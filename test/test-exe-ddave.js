/*
 * Extra tests for exe-ddave.
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

import assert from 'assert';
import TestUtil from './util.js';
import { exe_ddave as handler } from '../index.js';

const md = handler.metadata();
let testutil = new TestUtil(md.id);

describe(`Extra tests for ${md.title} [${md.id}]`, function() {

	describe('Real game files (if present)', function() {
		let content = {};

		before('load game files from local filesystem', function() {
			try {
				content = testutil.loadDirect(handler, [
					'dave.exe',
					'dave.cmp-lzexe.revealed',
				]);
			} catch (e) {
				console.log(e.message);
				this.skip();
			}
		});

		describe('identify()', function() {

			it('should recognise real game files', function() {
				const result = handler.identify(
					content['dave.exe'].main,
					content['dave.exe'].main.filename
				);
				assert.equal(result.valid, true, `Handler did not recognise ${content['dave.exe'].main.filename}: ${result.reason}`);
			});

		}); // identify()

		describe('extract()', function() {

			it('should extract attributes', function() {
				const exe = handler.extract(content['dave.exe']);

				assert.equal(exe.attributes['game.initial.level'].value, 1);
				assert.equal(exe.attributes['default.hsc.1.score'].value, 100);
				assert.equal(exe.attributes['filename.gfx.ega'].value, 'EGADAVE.DAV');
				assert.equal(exe.attributes['item.1.tile'].value, 2);
			});

		}); // extract()

		describe('patch()', function() {

			it('file comes out the same as it went in', async function() {
				const exe = handler.extract(content['dave.exe']);

				const contentGenerated = handler.patch(content['dave.exe'], exe);
				TestUtil.contentEqual(content['dave.cmp-lzexe.revealed'], contentGenerated);
			});

			it('high score conversion works', async function() {
				const exe = handler.extract(content['dave.exe']);

				assert.equal(exe.attributes['default.hsc.1.score'].value, 100);

				exe.attributes['default.hsc.1.score'].value = 12345;
				exe.attributes['default.hsc.2.score'].value = 1; // "00001"

				const contentGenerated = handler.patch(content['dave.exe'], exe);
				const exe2 = handler.extract(contentGenerated);

				assert.equal(exe2.attributes['default.hsc.1.score'].value, 12345);
				assert.equal(exe2.attributes['default.hsc.2.score'].value, 1);
			});

		}); // patch()

	}); // Real game files

}); // Extra tests
