/*
 * Extra tests for exe-cosmo1.
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
import { exe_cosmo1 as handler } from '../index.js';

const md = handler.metadata();
let testutil = new TestUtil(md.id);

describe(`Extra tests for ${md.title} [${md.id}]`, function() {

	describe('Real game files (if present)', function() {
		let content = {};

		before('load game files from local filesystem', function() {
			try {
				content = testutil.loadDirect(handler, [
					'cosmo1.exe',
					'cosmo1.cmp-lzexe.revealed',
				]);
			} catch (e) {
				console.log(e.message);
				this.skip();
			}
		});

		describe('identify()', function() {

			it('should recognise real game files', function() {
				const result = handler.identify(
					content['cosmo1.exe'].main,
					content['cosmo1.exe'].main.filename
				);
				assert.equal(result.valid, true, `Handler did not recognise `
					+ `${content['cosmo1.exe'].main.filename}: ${result.reason}`);
			});

		}); // identify()

		describe('extract()', function() {

			it('should extract attributes', function() {
				const exe = handler.extract(content['cosmo1.exe']);

				assert.equal(exe.attributes['filename.archive.standard'].value, 'COSMO1.STN');
				assert.equal(exe.attributes['filename.backdrop.1'].value, 'bdblank.mni');
			});

		}); // extract()

		describe('patch()', function() {

			it('file comes out the same as it went in', async function() {
				const exe = handler.extract(content['cosmo1.exe']);

				const contentGenerated = handler.patch(content['cosmo1.exe'], exe);
				TestUtil.contentEqual(content['cosmo1.cmp-lzexe.revealed'], contentGenerated);
			});

			it('modifying a field works', async function() {
				const exe = handler.extract(content['cosmo1.exe']);

				assert.equal(exe.attributes['filename.level.1'].value, 'A1.MNI');

				exe.attributes['filename.level.1'].value = 'XX.MNI';

				const contentGenerated = handler.patch(content['cosmo1.exe'], exe);
				const exe2 = handler.extract(contentGenerated);

				assert.equal(exe2.attributes['filename.level.1'].value, 'XX.MNI');
			});

		}); // patch()

	}); // Real game files

}); // Extra tests
