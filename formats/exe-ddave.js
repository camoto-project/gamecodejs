/*
 * Executable handler for Dangerous Dave.
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

const FORMAT_ID = 'exe-ddave';

import Debug from '../util/debug.js';
const debug = Debug.extend(FORMAT_ID);
import { RecordType } from '@camoto/record-io-buffer';

import CodeHandler_Simple from '../interface/CodeHandler_Simple.js';

const stringz = len => RecordType.string.fixed.reqTerm(len);

export default class Code_DDave extends CodeHandler_Simple
{
	static metadata() {
		let md = {
			...super.metadata(),
			id: FORMAT_ID,
			title: 'Dangerous Dave',
		};

		return md;
	}

	static identify(content) {
		return this.identifyBySignature(
			content,
			0x1600,
			[0x4F, 0x01, 0x75, 0x1F]
		);
	}

	static attributes() {
		return [
			{
				id: 'sfx.highscores.show',
				type: RecordType.int.u16le,
				offset: 0x8A9,
				valueType: 'sfx',
				desc: 'Sound effect when high scores window appears.',
			}, {
				id: 'sfx.highscores.entry',
				type: RecordType.int.u16le,
				offset: 0x904,
				valueType: 'sfx',
				desc: 'Sound effect played five times, once for each high score entry.',
			}, {
				id: 'sfx.collect.gun',
				type: RecordType.int.u16le,
				offset: 0x41A3,
				valueType: 'sfx',
				desc: 'Sound effect for collecting the gun.',
			}, {
				id: 'sfx.extralife',
				type: RecordType.int.u16le,
				offset: 0xCE0,
				valueType: 'sfx',
				desc: 'Sound effect for getting an extra life.',
			}, {
				id: 'ui.label.jetpack',
				type: RecordType.int.u16le,
				offset: 0x41C4,
				valueType: 'pixels',
				desc: 'Vertical coordinate of "Jetpack" (clipped to status area).',
			}, {
				id: 'game.endlevel.walkspeed',
				type: RecordType.int.u8,
				offset: 0x3D82,
				valueType: 'pixels',
				desc: 'How quickly the player walks across the screen in the end level cutscene.',
			}, {
				id: 'game.endlevel.walkend',
				type: RecordType.int.u16le,
				offset: 0x3D87,
				valueType: 'pixels',
				desc: 'How far the player must walk across the screen in the end level '
					+ 'cutscene.  Lower numbers end the scene earlier without having '
					+ 'made it all the way across the screen.',
			}, {
				id: 'game.endlevel.walk.sndtimer1',
				type: RecordType.int.u16le,
				offset: 0x3D6B,
				desc: 'Divisor for the timer that controls how fast the walk sound is '
					+ 'played in the end level cutscene.',
			}, {
				id: 'game.endlevel.walk.sndtimer2',
				type: RecordType.int.u8,
				offset: 0x3D72,
				desc: 'Comparison for the timer that controls how fast the walk sound '
					+ 'is played in the end level cutscene.',
			}, {
				id: 'game.initial.lives',
				type: RecordType.int.u16le,
				offset: 0x537F,
				valueType: 'lives',
				desc: 'Number of lives the player starts the game with.',
			}, {
				id: 'game.initial.scoreL',
				type: RecordType.int.u16le,
				offset: 0x5385,
				desc: 'Initial score when starting a new game (low 16 bits).',
			}, {
				id: 'game.initial.scoreH',
				type: RecordType.int.u16le,
				offset: 0x538B,
				desc: 'Initial score when starting a new game (high 16 bits).',
			}, {
				id: 'game.initial.level',
				type: RecordType.int.u16le,
				offset: 0x53A3,
				valueType: 'level',
				min: 1,
				max: 10,
				valueOffset: 1, // Convert from 0..9 in the .exe to 1..10.
				desc: 'Starting level number for a new game.',
			}, {
				id: 'scancode.f12',
				type: RecordType.int.u8,
				offset: 0x5724,
				valueType: 'scancode',
				desc: 'Should be 0x58 to work properly but the game ships with 0x59, '
					+ 'making it impossible to assign F12 to an action.',
			}, {
				id: 'filename.scores',
				type: stringz(12),
				offset: 0x2577E,
				valueType: 'filename',
				desc: 'Filename to save high scores to.',
			},
			{ id: 'map.state.1',   type: RecordType.int.u8, offset: 0x257E8, desc: 'Initial player state bitflags for level 1.' },
			{ id: 'map.state.2',   type: RecordType.int.u8, desc: 'Initial player state bitflags for level 2.' },
			{ id: 'map.state.3',   type: RecordType.int.u8, desc: 'Initial player state bitflags for level 3.' },
			{ id: 'map.state.4',   type: RecordType.int.u8, desc: 'Initial player state bitflags for level 4.' },
			{ id: 'map.state.5',   type: RecordType.int.u8, desc: 'Initial player state bitflags for level 5.' },
			{ id: 'map.state.6',   type: RecordType.int.u8, desc: 'Initial player state bitflags for level 6.' },
			{ id: 'map.state.7',   type: RecordType.int.u8, desc: 'Initial player state bitflags for level 7.' },
			{ id: 'map.state.8',   type: RecordType.int.u8, desc: 'Initial player state bitflags for level 8.' },
			{ id: 'map.state.9',   type: RecordType.int.u8, desc: 'Initial player state bitflags for level 9.' },
			{ id: 'map.state.10',  type: RecordType.int.u8, desc: 'Initial player state bitflags for level 10.' },
			{ id: 'map.startX.1',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for level 1.' },
			{ id: 'map.startX.2',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for level 2.' },
			{ id: 'map.startX.3',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for level 3.' },
			{ id: 'map.startX.4',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for level 4.' },
			{ id: 'map.startX.5',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for level 5.' },
			{ id: 'map.startX.6',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for level 6.' },
			{ id: 'map.startX.7',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for level 7.' },
			{ id: 'map.startX.8',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for level 8.' },
			{ id: 'map.startX.9',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for level 9.' },
			{ id: 'map.startX.10', type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for level 10.' },
			{ id: 'map.startY.1',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player Y-coordinate for level 1.' },
			{ id: 'map.startY.2',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player Y-coordinate for level 2.' },
			{ id: 'map.startY.3',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player Y-coordinate for level 3.' },
			{ id: 'map.startY.4',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player Y-coordinate for level 4.' },
			{ id: 'map.startY.5',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player Y-coordinate for level 5.' },
			{ id: 'map.startY.6',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player Y-coordinate for level 6.' },
			{ id: 'map.startY.7',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player Y-coordinate for level 7.' },
			{ id: 'map.startY.8',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player Y-coordinate for level 8.' },
			{ id: 'map.startY.9',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player Y-coordinate for level 9.' },
			{ id: 'map.startY.10', type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player Y-coordinate for level 10.' },

			{ id: 'map.startY.warp',     type: RecordType.int.u16le, offset: 0x1710, valueType: 'pixels', desc: 'Initial player Y-coordinate for ALL warp zones.' },
			{ id: 'map.state.warp',      type: RecordType.int.u16le, offset: 0x1716, desc: 'Initial player state bitflags for ALL warp zones.' },

			{ offset: 0x25862,
				id: 'map.scrollX.1.warp',  type: RecordType.int.u16le, valueType: 'tiles', desc: 'Initial horizontal scroll point for warp zone 1.' },
			{ id: 'map.scrollX.2.warp',  type: RecordType.int.u16le, valueType: 'tiles', desc: 'Initial horizontal scroll point for warp zone 2.' },
			{ id: 'map.scrollX.3.warp',  type: RecordType.int.u16le, valueType: 'tiles', desc: 'Initial horizontal scroll point for warp zone 3.' },
			{ id: 'map.scrollX.4.warp',  type: RecordType.int.u16le, valueType: 'tiles', desc: 'Initial horizontal scroll point for warp zone 4.' },
			{ id: 'map.scrollX.5.warp',  type: RecordType.int.u16le, valueType: 'tiles', desc: 'Initial horizontal scroll point for warp zone 5.' },
			{ id: 'map.scrollX.6.warp',  type: RecordType.int.u16le, valueType: 'tiles', desc: 'Initial horizontal scroll point for warp zone 6.' },
			{ id: 'map.scrollX.7.warp',  type: RecordType.int.u16le, valueType: 'tiles', desc: 'Initial horizontal scroll point for warp zone 7.' },
			{ id: 'map.scrollX.8.warp',  type: RecordType.int.u16le, valueType: 'tiles', desc: 'Initial horizontal scroll point for warp zone 8.' },
			{ id: 'map.scrollX.9.warp',  type: RecordType.int.u16le, valueType: 'tiles', desc: 'Initial horizontal scroll point for warp zone 9.' },
			{ id: 'map.scrollX.10.warp', type: RecordType.int.u16le, valueType: 'tiles', desc: 'Initial horizontal scroll point for warp zone 10.' },
			{ id: 'map.startX.1.warp',   type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for warp zone 1.' },
			{ id: 'map.startX.2.warp',   type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for warp zone 2.' },
			{ id: 'map.startX.3.warp',   type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for warp zone 3.' },
			{ id: 'map.startX.4.warp',   type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for warp zone 4.' },
			{ id: 'map.startX.5.warp',   type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for warp zone 5.' },
			{ id: 'map.startX.6.warp',   type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for warp zone 6.' },
			{ id: 'map.startX.7.warp',   type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for warp zone 7.' },
			{ id: 'map.startX.8.warp',   type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for warp zone 8.' },
			{ id: 'map.startX.9.warp',   type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for warp zone 9.' },
			{ id: 'map.startX.10.warp',  type: RecordType.int.u16le, valueType: 'pixels', desc: 'Initial player X-coordinate for warp zone 10.' },

			{ offset: 0x2590A,
				id: 'item.1.tile',    type: RecordType.int.u16le, valueType: 'tileIndex', desc: 'Tile number of item 1 in map tileset.' },
			{ id: 'item.2.tile',    type: RecordType.int.u16le, valueType: 'tileIndex', desc: 'Tile number of item 2 in map tileset.' },
			{ id: 'item.3.tile',    type: RecordType.int.u16le, valueType: 'tileIndex', desc: 'Tile number of item 3 in map tileset.' },
			{ id: 'item.4.tile',    type: RecordType.int.u16le, valueType: 'tileIndex', desc: 'Tile number of item 4 in map tileset.' },
			{ id: 'item.5.tile',    type: RecordType.int.u16le, valueType: 'tileIndex', desc: 'Tile number of item 5 in map tileset.' },
			{ id: 'item.6.tile',    type: RecordType.int.u16le, valueType: 'tileIndex', desc: 'Tile number of item 6 in map tileset.' },
			{ id: 'item.7.tile',    type: RecordType.int.u16le, valueType: 'tileIndex', desc: 'Tile number of item 7 in map tileset.' },
			{ id: 'item.8.tile',    type: RecordType.int.u16le, valueType: 'tileIndex', desc: 'Tile number of item 8 in map tileset.' },
			{ id: 'item.9.tile',    type: RecordType.int.u16le, valueType: 'tileIndex', desc: 'Tile number of item 9 in map tileset.' },
			{ id: 'item.10.tile',   type: RecordType.int.u16le, valueType: 'tileIndex', desc: 'Tile number of item 10 in map tileset.' },
			{ id: 'item.1.points',  type: RecordType.int.u16le, desc: 'Points awarded by item 1.' },
			{ id: 'item.2.points',  type: RecordType.int.u16le, desc: 'Points awarded by item 2.' },
			{ id: 'item.3.points',  type: RecordType.int.u16le, desc: 'Points awarded by item 3.' },
			{ id: 'item.4.points',  type: RecordType.int.u16le, desc: 'Points awarded by item 4.' },
			{ id: 'item.5.points',  type: RecordType.int.u16le, desc: 'Points awarded by item 5.' },
			{ id: 'item.6.points',  type: RecordType.int.u16le, desc: 'Points awarded by item 6.' },
			{ id: 'item.7.points',  type: RecordType.int.u16le, desc: 'Points awarded by item 7.' },
			{ id: 'item.8.points',  type: RecordType.int.u16le, desc: 'Points awarded by item 8.' },
			{ id: 'item.9.points',  type: RecordType.int.u16le, desc: 'Points awarded by item 9.' },
			{ id: 'item.10.points', type: RecordType.int.u16le, desc: 'Points awarded by item 10.' },

			{ offset: 0x25E9E,
				id: 'ui.header.score',  type: stringz(6) },
			// Skip level shown on title screen (arc-exe-ddave handles that)
			{ offset: 0x25EEA,
				id: 'msg.level.end.1',  type: stringz(35) },
			{ id: 'msg.level.end.9',  type: stringz(35) },
			{ id: 'msg.level.end.10', type: stringz(35) },

			{ id: 'default.hsc.1.level',    type: RecordType.int.u8, desc: 'Level number for default high score entry 1.' },
			{ id: 'default.hsc.1.digit.1',  type: RecordType.int.u8, desc: 'First digit in default high score entry 1.' },
			{ id: 'default.hsc.1.digit.2',  type: RecordType.int.u8, desc: 'Second digit in default high score entry 1.' },
			{ id: 'default.hsc.1.digit.3',  type: RecordType.int.u8, desc: 'Third digit in default high score entry 1.' },
			{ id: 'default.hsc.1.digit.4',  type: RecordType.int.u8, desc: 'Fourth digit in default high score entry 1.' },
			{ id: 'default.hsc.1.digit.5',  type: RecordType.int.u8, desc: 'Fifth digit in default high score entry 1.' },
			{ id: 'default.hsc.1.name',     type: RecordType.string.fixed.optTerm(3), desc: 'Player name in default high score entry 1.' },

			{ id: 'default.hsc.2.level',    type: RecordType.int.u8, desc: 'Level number for default high score entry 2.' },
			{ id: 'default.hsc.2.digit.1',  type: RecordType.int.u8, desc: 'First digit in default high score entry 2.' },
			{ id: 'default.hsc.2.digit.2',  type: RecordType.int.u8, desc: 'Second digit in default high score entry 2.' },
			{ id: 'default.hsc.2.digit.3',  type: RecordType.int.u8, desc: 'Third digit in default high score entry 2.' },
			{ id: 'default.hsc.2.digit.4',  type: RecordType.int.u8, desc: 'Fourth digit in default high score entry 2.' },
			{ id: 'default.hsc.2.digit.5',  type: RecordType.int.u8, desc: 'Fifth digit in default high score entry 2.' },
			{ id: 'default.hsc.2.name',     type: RecordType.string.fixed.optTerm(3), desc: 'Player name in default high score entry 2.' },

			{ id: 'default.hsc.3.level',    type: RecordType.int.u8, desc: 'Level number for default high score entry 3.' },
			{ id: 'default.hsc.3.digit.1',  type: RecordType.int.u8, desc: 'First digit in default high score entry 3.' },
			{ id: 'default.hsc.3.digit.2',  type: RecordType.int.u8, desc: 'Second digit in default high score entry 3.' },
			{ id: 'default.hsc.3.digit.3',  type: RecordType.int.u8, desc: 'Third digit in default high score entry 3.' },
			{ id: 'default.hsc.3.digit.4',  type: RecordType.int.u8, desc: 'Fourth digit in default high score entry 3.' },
			{ id: 'default.hsc.3.digit.5',  type: RecordType.int.u8, desc: 'Fifth digit in default high score entry 3.' },
			{ id: 'default.hsc.3.name',     type: RecordType.string.fixed.optTerm(3), desc: 'Player name in default high score entry 3.' },

			{ id: 'default.hsc.4.level',    type: RecordType.int.u8, desc: 'Level number for default high score entry 4.' },
			{ id: 'default.hsc.4.digit.1',  type: RecordType.int.u8, desc: 'First digit in default high score entry 4.' },
			{ id: 'default.hsc.4.digit.2',  type: RecordType.int.u8, desc: 'Second digit in default high score entry 4.' },
			{ id: 'default.hsc.4.digit.3',  type: RecordType.int.u8, desc: 'Third digit in default high score entry 4.' },
			{ id: 'default.hsc.4.digit.4',  type: RecordType.int.u8, desc: 'Fourth digit in default high score entry 4.' },
			{ id: 'default.hsc.4.digit.5',  type: RecordType.int.u8, desc: 'Fifth digit in default high score entry 4.' },
			{ id: 'default.hsc.4.name',     type: RecordType.string.fixed.optTerm(3), desc: 'Player name in default high score entry 4.' },

			{ id: 'default.hsc.5.level',    type: RecordType.int.u8, desc: 'Level number for default high score entry 5.' },
			{ id: 'default.hsc.5.digit.1',  type: RecordType.int.u8, desc: 'First digit in default high score entry 5.' },
			{ id: 'default.hsc.5.digit.2',  type: RecordType.int.u8, desc: 'Second digit in default high score entry 5.' },
			{ id: 'default.hsc.5.digit.3',  type: RecordType.int.u8, desc: 'Third digit in default high score entry 5.' },
			{ id: 'default.hsc.5.digit.4',  type: RecordType.int.u8, desc: 'Fourth digit in default high score entry 5.' },
			{ id: 'default.hsc.5.digit.5',  type: RecordType.int.u8, desc: 'Fifth digit in default high score entry 5.' },
			{ id: 'default.hsc.5.name',     type: RecordType.string.fixed.optTerm(3), desc: 'Player name in default high score entry 5.' },

			{ id: 'msg.hsc',           type: stringz(22) },
			{ id: 'msg.gameover',      type: stringz(10) },
			{ id: 'msg.hsc.header',    type: stringz(55) },
			{ id: 'msg.hsc.entry.eol', type: stringz(4), desc: 'Printed after each high score entry to go to the next line ready for the next entry.' },
			{ id: 'msg.restart',       type: stringz(24) },

			{ id: 'msg.help.1.1',      type: stringz(26) },
			{ id: 'msg.help.1.2',      type: stringz(24) },
			{ id: 'msg.help.1.3',      type: stringz(25) },
			{ id: 'msg.help.1.4',      type: stringz(20) },
			{ id: 'msg.help.1.5',      type: stringz(25) },
			{ id: 'msg.help.1.6',      type: stringz(26) },
			{ id: 'msg.help.1.7',      type: stringz(16) },
			{ id: 'msg.help.1.8',      type: stringz(12) },
			{ id: 'msg.help.1.9',      type: stringz(21) },
			{ id: 'msg.help.1.10',     type: stringz(20) },
			{ id: 'msg.help.1.11',     type: stringz(18) },
			{ id: 'msg.help.1.12',     type: stringz(26) },
			{ id: 'msg.help.1.13',     type: stringz(22) },
			{ id: 'msg.help.2.1',      type: stringz(25) },
			{ id: 'msg.help.2.2',      type: stringz(28) },
			{ id: 'msg.help.2.3',      type: stringz(27) },
			{ id: 'msg.help.2.4',      type: stringz(28) },
			{ id: 'msg.help.2.5',      type: stringz(28) },
			{ id: 'msg.help.2.6',      type: stringz(24) },
			{ id: 'msg.help.2.7',      type: stringz(29) },
			{ id: 'msg.help.2.8',      type: stringz(29) },
			{ id: 'msg.help.2.9',      type: stringz(29) },
			{ id: 'msg.help.2.10',     type: stringz(27) },
			{ id: 'msg.help.2.11',     type: stringz(29) },
			{ id: 'msg.help.2.12',     type: stringz(29) },
			{ id: 'msg.help.2.13',     type: stringz(29) },
			{ id: 'msg.help.2.14',     type: stringz(18) },
			{ id: 'msg.help.2.15',     type: stringz(22) },
			{ id: 'msg.help.3.1',      type: stringz(25) },
			{ id: 'msg.help.3.2',      type: stringz(28) },
			{ id: 'msg.help.3.3',      type: stringz(29) },
			{ id: 'msg.help.3.4',      type: stringz(28) },
			{ id: 'msg.help.3.5',      type: stringz(29) },
			{ id: 'msg.help.3.6',      type: stringz(30) },
			{ id: 'msg.help.3.7',      type: stringz(30) },
			{ id: 'msg.help.3.8',      type: stringz(27) },
			{ id: 'msg.help.3.9',      type: stringz(15) },
			{ id: 'msg.help.3.10',     type: stringz(27) },
			{ id: 'msg.help.3.11',     type: stringz(29) },
			{ id: 'msg.help.3.12',     type: stringz(28) },
			{ id: 'msg.help.3.13',     type: stringz(17) },
			{ id: 'msg.help.3.14',     type: stringz(20) },
			{ id: 'msg.quit',          type: stringz(16) },
			{ id: 'msg.pause',         type: stringz(23) },
			{ id: 'filename.gfx.ega',  type: stringz(12) },
			{ id: 'msg.title.1',       type: stringz(22) },
			{ id: 'msg.title.2',       type: stringz(27) },
			{ id: 'msg.title.3',       type: stringz(26) },
			{ id: 'msg.end.1',         type: stringz(30) },
			{ id: 'msg.end.2',         type: stringz(37) },
			{ id: 'msg.end.3',         type: stringz(33) },
			{ id: 'msg.end.4',         type: stringz(31) },
			{ id: 'msg.end.5',         type: stringz(37) },
			{ id: 'msg.end.6',         type: stringz(36) },
			{ id: 'msg.end.7',         type: stringz(35) },
			{ id: 'msg.end.8',         type: stringz(36) },
			{ id: 'msg.end.9',         type: stringz(35) },
			{ id: 'msg.end.10',        type: stringz(23) },

			{ id: 'cp.row.video',      type: RecordType.int.u16le, len: 2, desc: 'Control Panel: Which row the video device selection appears on.' },
			{ id: 'cp.row.sound',      type: RecordType.int.u16le, len: 2, desc: 'Control Panel: Which row the sound device selection appears on.' },
			{ id: 'cp.row.input',      type: RecordType.int.u16le, len: 2, desc: 'Control Panel: Which row the input device selection appears on.' },
			{ id: 'cp.row.unknown',    type: RecordType.int.u16le, len: 2, desc: 'Control Panel: Unknown effect.' },
			{ id: 'cp.col.1',          type: RecordType.int.u16le, len: 2, desc: 'Control Panel: Position of first column of devices.' },
			{ id: 'cp.col.2',          type: RecordType.int.u16le, len: 2, desc: 'Control Panel: Position of second column of devices.' },
			{ id: 'cp.col.3',          type: RecordType.int.u16le, len: 2, desc: 'Control Panel: Position of third column of devices.' },
			{ id: 'cp.col.4',          type: RecordType.int.u16le, len: 2, desc: 'Control Panel: Position of fourth column of devices.' },
			{ id: 'cp.keynames',       type: RecordType.string.fixed.optTerm(128), desc: 'Key names shown when selecting keyboard buttons.' },
			{ id: 'cp.msg.joy.1',      type: stringz(26) },
			{ id: 'cp.msg.joy.2',      type: stringz(26) },
			{ id: 'cp.msg.joy.3',      type: stringz(27) },
			{ id: 'cp.msg.joy.4',      type: stringz(13) },
			{ id: 'cp.msg.joy.5',      type: stringz(21) },
			{ id: 'cp.msg.joy.6',      type: stringz(30) },
			{ id: 'cp.msg.joy.7',      type: stringz(14) },
			{ id: 'cp.msg.joy.8',      type: stringz(21) },
			{ id: 'cp.msg.mouse.1',    type: stringz(27) },
			{ id: 'cp.msg.mouse.2',    type: stringz(27) },
			{ id: 'cp.msg.mouse.3',    type: stringz(27) },
			{ id: 'cp.msg.mouse.4',    type: stringz(27) },
			{ id: 'cp.msg.mouse.5',    type: stringz(20) },
			{ id: 'cp.keyname.esc',    type: stringz(4) },
			{ id: 'cp.keyname.bksp',   type: stringz(5) },
			{ id: 'cp.keyname.tab',    type: stringz(4) },
			{ id: 'cp.keyname.ctrl',   type: stringz(5) },
			{ id: 'cp.keyname.lshift', type: stringz(7) },
			{ id: 'cp.keyname.space',  type: stringz(6) },
			{ id: 'cp.keyname.caps',   type: stringz(7) },
			{ id: 'cp.keyname.fx',     type: stringz(2) },
			{ id: 'cp.keyname.f11',    type: stringz(4) },
			{ id: 'cp.keyname.f12',    type: stringz(4) },
			{ id: 'cp.keyname.scroll', type: stringz(7) },
			{ id: 'cp.keyname.enter',  type: stringz(6) },
			{ id: 'cp.keyname.rshift', type: stringz(7) },
			{ id: 'cp.keyname.prtsc',  type: stringz(6) },
			{ id: 'cp.keyname.alt',    type: stringz(4) },
			{ id: 'cp.keyname.home',   type: stringz(5) },
			{ id: 'cp.keyname.pgup',   type: stringz(5) },
			{ id: 'cp.keyname.end',    type: stringz(4) },
			{ id: 'cp.keyname.pgdn',   type: stringz(5) },
			{ id: 'cp.keyname.ins',    type: stringz(4) },
			{ id: 'cp.keyname.del',    type: stringz(4) },
			{ id: 'cp.keyname.num',    type: stringz(6) },
			{ id: 'cp.msg.keyb.1',     type: stringz(25) },
			{ id: 'cp.msg.keyb.2',     type: stringz(23) },
			{ id: 'cp.msg.keyb.3',     type: stringz(15) },
			{ id: 'cp.msg.keyb.4',     type: stringz(15) },
			{ id: 'cp.msg.keyb.5',     type: stringz(15) },
			{ id: 'cp.msg.keyb.6',     type: stringz(15) },
			{ id: 'cp.msg.keyb.7',     type: stringz(15) },
			{ id: 'cp.msg.keyb.8',     type: stringz(15) },
			{ id: 'cp.msg.keyb.9',     type: stringz(15) },
			{ id: 'cp.msg.keyb.10',    type: stringz(15) },
			{ id: 'cp.msg.keyb.11',    type: stringz(15) },
			{ id: 'cp.msg.keyb.12',    type: stringz(15) },
			{ id: 'cp.msg.keyb.13',    type: stringz(24) },
			{ id: 'cp.msg.keyb.14',    type: stringz(21) },
			{ id: 'cp.msg.keyb.15',    type: stringz(20), desc: 'Set after a key is chosen, erases the "Press the new key" message.' },
			{ id: 'cp.msg.keyb.16',    type: stringz(9), desc: 'Printed after key name to erase any previous key name that was longer than the new key name.' },
			{ id: 'cp.main.title',     type: stringz(26) },
			{ id: 'cp.main.video',     type: stringz(7) },
			{ id: 'cp.main.sound',     type: stringz(7) },
			{ id: 'cp.main.input',     type: stringz(9) },
			{ id: 'cp.main.footer.1',  type: stringz(41) },
			{ id: 'cp.main.footer.2',  type: stringz(41) },
			{ id: 'cp.main.footer.3',  type: stringz(42) },
		];
	}

	static extract(content) {
		let values = super.extract(content);

		// Tidy up some values first.
		let attributes = values.attributes;
		for (let i = 1; i <= 5; i++) {
			let score = 0;
			for (let s = 0; s < 5; s++) {
				const multiplier = Math.pow(10, 4-s);
				const keyDigit = `default.hsc.${i}.digit.${s + 1}`;
				score += multiplier * attributes[keyDigit].value;
				delete attributes[keyDigit];
			}
			const keyNew = `default.hsc.${i}.score`;
			attributes[keyNew] = {
				id: keyNew,
				value: score,
				desc: `Actual score for default high score entry ${i}.`,
			};
		}

		return values;
	}

	static patch(content, exe) {
		let updated = {};

		// Return the high score values back to what they were originally.
		for (let i = 1; i <= 5; i++) {
			let score = parseInt(exe.attributes[`default.hsc.${i}.score`].value);
			for (let s = 5; s >= 1; s--) {
				updated[`default.hsc.${i}.digit.${s}`] = {
					value: score % 10,
				};
				score = (score / 10) >>> 0;
			}
			// No need to remove the .score one we added, it'll just be ignored.
		}

		return super.patch(content, {
			...exe,
			attributes: {
				...exe.attributes,
				...updated,
			},
		});
	}
}
