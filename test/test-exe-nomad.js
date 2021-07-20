/*
 * Extra tests for exe-nomad.
 *
 * Copyright (C) 2010-2021 Adam Nielsen <malvineous@shikadi.net>
 * Copyright (C) 2021 Colin Bourassa
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
import { exe_nomad as handler } from '../index.js';

const md = handler.metadata();
let testutil = new TestUtil(md.id);

describe(`Extra tests for ${md.title} [${md.id}]`, function() {

	describe('Real game files (if present)', function() {
		let content = {};

		before('load game files from local filesystem', function() {
			try {
				content = testutil.loadDirect(handler, [
					'nomad.exe',
				]);
			} catch (e) {
				console.log(e.message);
				this.skip();
			}
		});

		describe('identify()', function() {

			it('should recognise real game files', function() {
				const result = handler.identify(
					content['nomad.exe'].main,
					content['nomad.exe'].main.filename
				);
				assert.equal(result.valid, true, `Handler did not recognise `
					+ `${content['nomad.exe'].main.filename}: ${result.reason}`);
			});

		}); // identify()

		describe('extract()', function() {

			it('should extract attributes', function() {
				const exe = handler.extract(content['nomad.exe']);

				assert.equal(exe.attributes['filename.cfg'].value, 'nomad.cfg');
				assert.equal(exe.attributes['filename.gametext'].value, 'GAMETEXT.TXT');
				assert.equal(exe.attributes['planet.orbit-distance.multiplier.common'].value, 1);
				assert.equal(exe.attributes['planet.rotation-per-frame.second-harmony'].value, 512);
			});

		}); // extract()

		describe('patch()', function() {

			it('file comes out the same as it went in', async function() {
				const exe = handler.extract(content['nomad.exe']);

				const contentGenerated = handler.patch(content['nomad.exe'], exe);
				TestUtil.contentEqual(content['nomad.exe'], contentGenerated);
			});

		}); // patch()

	}); // Real game files

}); // Extra tests
