/**
 * @file Base class and defaults for executable format handlers.
 *
 * Copyright (C) 2020-2021 Adam Nielsen <malvineous@shikadi.net>
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

/**
 * Base class and defaults for executable format handlers.
 *
 * To implement a new file format, this is the class that will be extended and
 * its methods replaced with ones that perform the work.
 *
 * @name CodeHandler
 */
export default class CodeHandler
{
	/**
	 * Retrieve information about the executable file format.
	 *
	 * This must be overridden by all format handlers.  It returns a structure
	 * detailed below.
	 *
	 * @return {object} metadata.
	 */
	static metadata() {
		return {
			/**
			 * @typedef {object} Metadata
			 *
			 * @property {string} id
			 *   A unique identifier for the format.
			 *
			 * @property {string} title
			 *   The user-friendly title for the format.
			 */
			id: 'unknown',
			title: 'Unknown format',
		};
	}

	/**
	 * Get a list of supplementary files needed to use the format.
	 *
	 * Some formats store their data across multiple files, and this function
	 * will return a list of filenames needed, based on the filename and data in
	 * the main executable file.
	 *
	 * This allows both the filename and file content to be examined, in case
	 * either of these are needed to construct the name of the supplementary
	 * files.
	 *
	 * @param {string} name
	 *   Executable filename.
	 *
	 * @param {Uint8Array} content
	 *   Executable content.
	 *
	 * @return {null} if there are no supplementary files, otherwise an {Object}
	 *   where each key is an identifier specific to the handler, and the value
	 *   is the expected case-insensitive filename.  Don't convert passed names
	 *   to lowercase, but any changes (e.g. appending a filename extension)
	 *   should be lowercase.
	 */
	// eslint-disable-next-line no-unused-vars
	static supps(name, content) {
		return null;
	}

	/**
	 * See if the given executable is in the format supported by this handler.
	 *
	 * This is used for format autodetection.
	 *
	 * @param {Uint8Array} content
	 *   The executable to examine.
	 *
	 * @return {Boolean} true if the data is definitely in this format, false if
	 *   it is definitely not in this format, and undefined if the data could not
	 *   be positively identified but it's possible it is in this format.
	 */
	// eslint-disable-next-line no-unused-vars
	static identify(content) {
		return {
			valid: false,
			reason: 'identify() is unimplemented for this format.',
		};
	}

	/**
	 * Extract information from the given executable file.
	 *
	 * @param {Object} content
	 *   File content of the executable.  The `main` property contains the main
	 *   file, with any other supps as other properties.  Each property is a
	 *   {Uint8Array}.
	 *
	 * @return {Array<Attributes>} detailing the contents of the executable file.
	 */
	// eslint-disable-next-line no-unused-vars
	static extract(content) {
		throw new Error('Not implemented yet.');
	}

	/**
	 * Write modified information to an executable in-place.
	 *
	 * @param {Object} content
	 *   File content of the executable.  The `main` property contains the main
	 *   file, with any other supps as other properties.  Each property is a
	 *   {Uint8Array}.  These values should be modified as needed.
	 *
	 * @param {Array<Attributes>} attributes
	 *   The values to write to the file.  Omit any that have not been changed
	 *   since being returned by extract().
	 */
	// eslint-disable-next-line no-unused-vars
	static patch(content, attributes) {
		throw new Error('Not implemented yet.');
	}
};
