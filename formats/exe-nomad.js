/*
 * Executable handler for Nomad.
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

const FORMAT_ID = 'exe-nomad';

import Debug from '../util/debug.js';
const debug = Debug.extend(FORMAT_ID);
import {
	RecordType
} from '@camoto/record-io-buffer';

import CodeHandler_Simple from '../interface/CodeHandler_Simple.js';

const stringz = len => RecordType.string.fixed.reqTerm(len);

export default class Code_Nomad extends CodeHandler_Simple {
	static metadata() {
		let md = {
			...super.metadata(),
			id: FORMAT_ID,
			title: 'Nomad',
		};

		return md;
	}

	static identify(content) {
		// Identify only v1.01; the earlier v1.00 is not supported
		return this.identifyBySignature(
			content,
			0x30241,
			[0x31, 0x2E, 0x30, 0x31]
		);
	}

	static attributes() {
		return [{
			id: 'planet.orbit-distance.multiplier.common',
			type: RecordType.int.u16le,
			offset: 0x19DF5,
			desc: 'Multiplier for the player\'s apparent orbital distance above most planets.'
		}, {
			id: 'planet.orbit-distance.multiplier.losten',
			type: RecordType.int.u16le,
			offset: 0x19DFD,
			desc: 'Multiplier for the player\'s apparent orbital distance above the planet Losten.'
		}, {
			id: 'planet.rotation-per-frame.second-harmony',
			type: RecordType.int.s16le,
			offset: 0x19F7D,
			desc: 'Number of angular steps through which the starbase Second Harmony rotates per frame. ' +
					'A higher absolute value results in faster rotation. Negative numbers cause rotation ' +
					'in the opposite direction.'
		}, {
			id: 'text.intro.subtitles.0',
			type: stringz(80),
			offset: 0x23DD0,
			desc: 'Introductory briefing, first subtitle'
		}, {
			id: 'text.intro.subtitles.1',
			type: stringz(64),
			offset: 0x23E20,
			desc: 'Introductory briefing, second subtitle'
		}, {
			id: 'text.intro.subtitles.2',
			type: stringz(80),
			offset: 0x23E60,
			desc: 'Introductory briefing, third subtitle'
		}, {
			id: 'text.intro.subtitles.3',
			type: stringz(128),
			offset: 0x23EB0,
			desc: 'Introductory briefing, fourth subtitle'
		}, {
			id: 'text.intro.subtitles.4',
			type: stringz(48),
			offset: 0x23F30,
			desc: 'Introductory briefing, fifth subtitle'
		}, {
			id: 'text.intro.subtitles.5',
			type: stringz(128),
			offset: 0x23F60,
			desc: 'Introductory briefing, sixth subtitle'
		}, {
			id: 'text.intro.subtitles.6',
			type: stringz(64),
			offset: 0x23FE0,
			desc: 'Introductory briefing, seventh subtitle'
		}, {
			id: 'text.intro.subtitles.7',
			type: stringz(48),
			offset: 0x24020,
			desc: 'Introductory briefing, eighth subtitle'
		}, {
			id: 'text.intro.oesi-msg',
			type: stringz(53),
			offset: 0x317EE,
			desc: 'Introductory briefing, attention banner for OESI message'
		}, {
			id: 'text.banner',
			type: stringz(49),
			offset: 0x3023A,
			desc: 'Version and timestamp startup banner'
		}, {
			id: 'text.log.header',
			type: RecordType.string.fixed.optTerm(18),
			offset: 0x32CD1,
			desc: 'Header line for in-game log; CRLF will be automatically appended'
		},

		{
			id: 'filename.cfg',
			type: stringz(10),
			offset: 0x31B34,
			desc: 'Config filename'
		}, {
			id: 'filename.save.pattern',
			type: stringz(6),
			offset: 0x30ADE,
			desc: 'Filename pattern for saved games'
		}, {
			id: 'filename.font.large',
			type: stringz(11),
			offset: 0x31BC2,
			desc: 'Large font filename'
		}, {
			id: 'filename.font.small',
			type: stringz(11),
			offset: 0x31BCD,
			desc: 'Small font filename'
		}, {
			id: 'filename.gametext',
			type: stringz(13),
			offset: 0x31BD8,
			desc: 'Gametext filename'
		},

		{
			id: 'filename.3dmodel.intro-snowfield',
			type: stringz(11),
			offset: 0x3195A,
			desc: 'Filename of 3D ship model shown crashing into snow during intro sequence'
		}, {
			id: 'filename.3dmodel.intro-earthscape',
			type: stringz(11),
			offset: 0x3135B,
			desc: 'Filename of 3D ship model shown departing Earth during intro sequence'
		}, {
			id: 'filename.3dmodel.player-travel',
			type: stringz(11),
			offset: 0x32A11,
			desc: 'Filename of 3D ship model shown during player travel sequence'
		},

		{
			id: 'filename.dat.converse',
			type: stringz(13),
			offset: 0x31AFE,
			desc: 'CONVERSE.DAT filename'
		}, {
			id: 'filename.dat.test',
			type: stringz(9),
			offset: 0x31B0B,
			desc: 'TEST.DAT filename'
		}, {
			id: 'filename.dat.anim',
			type: stringz(9),
			offset: 0x31B14,
			desc: 'ANIM.DAT filename'
		}, {
			id: 'filename.dat.samples',
			type: stringz(12),
			offset: 0x31B1D,
			desc: 'SAMPLES.DAT filename'
		}, {
			id: 'filename.dat.invent',
			type: stringz(11),
			offset: 0x31B29,
			desc: 'INVENT.DAT filename'
		},

		{
			id: 'filename.fullscreen.end1a',
			type: stringz(6),
			offset: 0x3126C,
			desc: 'Fullscreen image filename for endgame (player\'s crashed escape pod)'
		}, {
			id: 'filename.fullscreen.end1b',
			type: stringz(6),
			offset: 0x31272,
			desc: 'Fullscreen image filename for endgame (player\'s crashed escape pod)'
		}, {
			id: 'filename.fullscreen.cred0001',
			type: stringz(9),
			offset: 0x31278,
			desc: 'Fullscreen image filename for credits page 1'
		}, {
			id: 'filename.fullscreen.cred0002',
			type: stringz(9),
			offset: 0x31281,
			desc: 'Fullscreen image filename for credits page 2'
		}, {
			id: 'filename.fullscreen.cred0003',
			type: stringz(9),
			offset: 0x3128A,
			desc: 'Fullscreen image filename for credits page 3'
		}, {
			id: 'filename.fullscreen.cred0004',
			type: stringz(9),
			offset: 0x31293,
			desc: 'Fullscreen image filename for credits page 4'
		}, {
			id: 'filename.fullscreen.cred0005',
			type: stringz(9),
			offset: 0x3129C,
			desc: 'Fullscreen image filename for credits page 5'
		}, {
			id: 'filename.fullscreen.cred0006',
			type: stringz(9),
			offset: 0x312A5,
			desc: 'Fullscreen image filename for credits page 6'
		}, {
			id: 'filename.fullscreen.getname',
			type: stringz(8),
			offset: 0x312AE,
			desc: 'Fullscreen image filename for cockpit newgame view'
		}, {
			id: 'filename.fullscreen.open08',
			type: stringz(7),
			offset: 0x312B6,
			desc: 'Fullscreen image filename for Earthscape'
		}, {
			id: 'filename.fullscreen.korok01',
			type: stringz(8),
			offset: 0x312BD,
			desc: 'Fullscreen image filename for endgame (Korok victory)'
		}, {
			id: 'filename.fullscreen.korok02',
			type: stringz(8),
			offset: 0x312C5,
			desc: 'Fullscreen image filename for endgame (Korok victory)'
		}, {
			id: 'filename.fullscreen.win01',
			type: stringz(6),
			offset: 0x312CD,
			desc: 'Fullscreen image filename for endgame (Alliance victory)'
		}, {
			id: 'filename.fullscreen.win03',
			type: stringz(6),
			offset: 0x312D3,
			desc: 'Fullscreen image filename for endgame (Alliance victory)'
		}, {
			id: 'filename.fullscreen.win04',
			type: stringz(6),
			offset: 0x312D9,
			desc: 'Fullscreen image filename for endgame (Alliance victory)'
		}, {
			id: 'filename.fullscreen.cock1',
			type: stringz(10),
			offset: 0x31901,
			desc: 'Fullscreen image filename for cockpit zoom out, frame 1'
		}, {
			id: 'filename.fullscreen.cock2',
			type: stringz(10),
			offset: 0x3190B,
			desc: 'Fullscreen image filename for cockpit zoom out, frame 2'
		}, {
			id: 'filename.fullscreen.cock3',
			type: stringz(10),
			offset: 0x31915,
			desc: 'Fullscreen image filename for cockpit zoom out, frame 3'
		}, {
			id: 'filename.fullscreen.cock4',
			type: stringz(10),
			offset: 0x3191F,
			desc: 'Fullscreen image filename for cockpit zoom out, frame 4'
		}, {
			id: 'filename.fullscreen.cock5',
			type: stringz(10),
			offset: 0x31929,
			desc: 'Fullscreen image filename for cockpit zoom out, frame 5'
		}, {
			id: 'filename.fullscreen.backg',
			type: stringz(10),
			offset: 0x31830,
			desc: 'Fullscreen image filename for title screen background'
		}, {
			id: 'filename.fullscreen.snow',
			type: stringz(9),
			offset: 0x31869,
			desc: 'Fullscreen image filename for snowfield background'
		}, {
			id: 'filename.fullscreen.oesi',
			type: stringz(9),
			offset: 0x31933,
			desc: 'Fullscreen image filename for OESI logo'
		}, {
			id: 'filename.fullscreen.fixed',
			type: stringz(10),
			offset: 0x31948,
			desc: 'Fullscreen image filename for repaired ship in hangar'
		}, {
			id: 'filename.fullscreen.crashed',
			type: stringz(12),
			offset: 0x3193C,
			desc: 'Fullscreen image filename for crashed ship in snow'
		}, {
			id: 'filename.stamp.pscan',
			type: stringz(10),
			offset: 0x32DFA,
			desc: 'Stamp image filename for planet scan border'
		}, {
			id: 'filename.stamp.navmap',
			type: stringz(11),
			offset: 0x34C82,
			desc: 'Stamp image filename for nav map galaxy background'
		}, {
			id: 'filename.stamp.navbkgnd',
			type: stringz(13),
			offset: 0x34C8D,
			desc: 'Stamp image filename for nav map sector background'
		}, {
			id: 'filename.stamp.gtek',
			type: stringz(10),
			offset: 0x3184E,
			desc: 'Stamp image filename for GameTek intro logo'
		}, {
			id: 'filename.stamp.design',
			type: stringz(11),
			offset: 0x31843,
			desc: 'Stamp image filename for Intense! Interactive intro logo'
		}, {
			id: 'filename.stamp.papyrus',
			type: stringz(12),
			offset: 0x31858,
			desc: 'Stamp image filename for Papyrus Design Group intro logo'
		}, {
			id: 'filename.stamp.border',
			type: stringz(11),
			offset: 0x318F6,
			desc: 'Stamp image filename for intro briefing border'
		}, {
			id: 'filename.stamp.guybody',
			type: stringz(12),
			offset: 0x3188D,
			desc: 'Stamp image filename for intro briefing guy'
		}, {
			id: 'filename.stamp.sh01',
			type: stringz(9),
			offset: 0x33095,
			desc: 'Stamp image filename for ship shield, frame A'
		}, {
			id: 'filename.stamp.sh02',
			type: stringz(9),
			offset: 0x3309E,
			desc: 'Stamp image filename for ship shield, frame B'
		}, {
			id: 'filename.stamproll.shipst',
			type: stringz(11),
			offset: 0x351A2,
			desc: 'Stamp image filename for engineering system icons'
		}, {
			id: 'filename.stamproll.shp',
			type: stringz(8),
			offset: 0x33000,
			desc: 'Stamp image filename for ship scan schematics'
		}, {
			id: 'filename.stamproll.smk',
			type: stringz(8),
			offset: 0x31885,
			desc: 'Stamp image filename for snow crash animation'
		}, {
			id: 'filename.stamproll.guyhead',
			type: stringz(12),
			offset: 0x31899,
			desc: 'Stamp image filename for intro briefing guy head animation A'
		}, {
			id: 'filename.stamproll.guyhead2',
			type: stringz(13),
			offset: 0x31885,
			desc: 'Stamp image filename for intro briefing guy head animation B'
		}, {
			id: 'filename.stamproll.guyturn',
			type: stringz(12),
			offset: 0x318A5,
			desc: 'Stamp image filename for intro briefing guy body animation'
		},

		{
			id: 'filename.sounds.always',
			type: stringz(7),
			offset: 0x30465,
			desc: 'Sound library filename for common effects'
		}, {
			id: 'filename.sounds.archbot',
			type: stringz(8),
			offset: 0x345AE,
			desc: 'Sound library filename for arch-bot voice'
		}, {
			id: 'filename.sounds.atlosten',
			type: stringz(9),
			offset: 0x3380B,
			desc: 'Sound library filename for Losten gateway effects'
		}, {
			id: 'filename.sounds.botsend',
			type: stringz(8),
			offset: 0x30504,
			desc: 'Sound library filename for labor bot transport announcements'
		}, {
			id: 'filename.sounds.cargo',
			type: stringz(6),
			offset: 0x30511,
			desc: 'Sound library filename for cargo stowage effects'
		}, {
			id: 'filename.sounds.cfirst',
			type: stringz(7),
			offset: 0x3141C,
			desc: 'Sound library filename for newgame screen computer voice'
		}, {
			id: 'filename.sounds.comlink',
			type: stringz(8),
			offset: 0x304D7,
			desc: 'Sound library filename for comlink effects'
		}, {
			id: 'filename.sounds.end',
			type: stringz(4),
			offset: 0x31305,
			desc: 'Sound library filename for losing endgame scenario narration and effects'
		}, {
			id: 'filename.sounds.failsafe',
			type: stringz(9),
			offset: 0x306FD,
			desc: 'Sound library filename for failsafe effects'
		}, {
			id: 'filename.sounds.farmbot',
			type: stringz(8),
			offset: 0x34596,
			desc: 'Sound library filename for farm-bot voice'
		}, {
			id: 'filename.sounds.fix',
			type: stringz(4),
			offset: 0x304DF,
			desc: 'Sound library filename for pending ship repair announcements'
		}, {
			id: 'filename.sounds.fixed',
			type: stringz(6),
			offset: 0x304E3,
			desc: 'Sound library filename for completed repair announcements'
		}, {
			id: 'filename.sounds.gasbot',
			type: stringz(7),
			offset: 0x34587,
			desc: 'Sound library filename for gas-bot voice'
		}, {
			id: 'filename.sounds.humm',
			type: stringz(5),
			offset: 0x31314,
			desc: 'Sound library filename for static noise'
		}, {
			id: 'filename.sounds.invnav',
			type: stringz(7),
			offset: 0x33C3E,
			desc: 'Sound library filename for nav map zoom effects'
		}, {
			id: 'filename.sounds.land',
			type: stringz(5),
			offset: 0x31328,
			desc: 'Sound library filename for rocket / flyby effect'
		}, {
			id: 'filename.sounds.lose',
			type: stringz(5),
			offset: 0x31309,
			desc: 'Sound library filename for losing endgame scenario narration'
		}, {
			id: 'filename.sounds.mend',
			type: stringz(5),
			offset: 0x31323,
			desc: 'Sound library filename for end credits fanfare'
		}, {
			id: 'filename.sounds.minebot',
			type: stringz(8),
			offset: 0x3458E,
			desc: 'Sound library filename for ore-bot voice'
		}, {
			id: 'filename.sounds.ranchbot',
			type: stringz(9),
			offset: 0x345A5,
			desc: 'Sound library filename for ranch-bot voice'
		}, {
			id: 'filename.sounds.planet2',
			type: stringz(8),
			offset: 0x369AB,
			desc: 'Sound library filename for labor bot landing effects'
		}, {
			id: 'filename.sounds.scan',
			type: stringz(5),
			offset: 0x3069B,
			desc: 'Sound library filename for scanning effects'
		}, {
			id: 'filename.sounds.shields',
			type: stringz(8),
			offset: 0x304E9,
			desc: 'Sound library filename for shield status announcements'
		}, {
			id: 'filename.sounds.shoot1',
			type: stringz(7),
			offset: 0x304F6,
			desc: 'Sound library filename for missile status announcements'
		}, {
			id: 'filename.sounds.shoot2',
			type: stringz(7),
			offset: 0x304FD,
			desc: 'Sound library filename for missile effects'
		}, {
			id: 'filename.sounds.spybot',
			type: stringz(7),
			offset: 0x3459E,
			desc: 'Sound library filename for spy-bot voice'
		}, {
			id: 'filename.sounds.talk',
			type: stringz(5),
			offset: 0x3050C,
			desc: 'Sound library filename for text and missile lock effects'
		}, {
			id: 'filename.sounds.them',
			type: stringz(5),
			offset: 0x304F1,
			desc: 'Sound library filename for alien ship activity announcements'
		}, {
			id: 'filename.sounds.theme',
			type: stringz(6),
			offset: 0x312FF,
			desc: 'Sound library filename for theme music'
		}, {
			id: 'filename.sounds.timelock',
			type: stringz(9),
			offset: 0x30531,
			desc: 'Sound library filename for timelock announcements and effects'
		}, {
			id: 'filename.sounds.warp2',
			type: stringz(6),
			offset: 0x30517,
			desc: 'Sound library filename for ships entering/leaving warp'
		}, {
			id: 'filename.sounds.warp4',
			type: stringz(6),
			offset: 0x329B0,
			desc: 'Sound library filename for warp engine power-up/power-down effects'
		}, {
			id: 'filename.sounds.win',
			type: stringz(4),
			offset: 0x3131F,
			desc: 'Sound library filename for winning endgame scenario narration'
		}, {
			id: 'filename.sounds.alien.theme.altec',
			type: stringz(6),
			offset: 0x31C8E,
			desc: 'Sound library filename for Altec Hocker theme'
		}, {
			id: 'filename.sounds.alien.theme.arden',
			type: stringz(6),
			offset: 0x31C94,
			desc: 'Sound library filename for Arden theme'
		}, {
			id: 'filename.sounds.alien.theme.bellicosian',
			type: stringz(7),
			offset: 0x31C9A,
			desc: 'Sound library filename for Bellicosian theme'
		}, {
			id: 'filename.sounds.alien.theme.chanticleer',
			type: stringz(8),
			offset: 0x31CA1,
			desc: 'Sound library filename for Chanticleer theme'
		}, {
			id: 'filename.sounds.alien.theme.korok',
			type: stringz(6),
			offset: 0x31CB1,
			desc: 'Sound library filename for Korok theme'
		}, {
			id: 'filename.sounds.alien.theme.musin',
			type: stringz(6),
			offset: 0x31CB7,
			desc: 'Sound library filename for Musin theme'
		}, {
			id: 'filename.sounds.alien.theme.pahrump',
			type: stringz(8),
			offset: 0x31CBD,
			desc: 'Sound library filename for Pahrump theme'
		}, {
			id: 'filename.sounds.alien.theme.phelonese',
			type: stringz(9),
			offset: 0x31CC5,
			desc: 'Sound library filename for Phelonese theme'
		}, {
			id: 'filename.sounds.alien.theme.shaasa',
			type: stringz(7),
			offset: 0x31CCE,
			desc: 'Sound library filename for Shaasa theme'
		}, {
			id: 'filename.sounds.alien.theme.ursor',
			type: stringz(6),
			offset: 0x31CD5,
			desc: 'Sound library filename for Ursor theme'
		}, {
			id: 'filename.sounds.alien.speech.kenelm1',
			type: stringz(8),
			offset: 0x31D7F,
			desc: 'Sound library filename for Kenelm speech, part 1'
		}, {
			id: 'filename.sounds.alien.speech.kenelm2',
			type: stringz(8),
			offset: 0x31D77,
			desc: 'Sound library filename for Kenelm speech, part 2'
		}, {
			id: 'filename.sounds.alien.speech.kenelm3',
			type: stringz(8),
			offset: 0x31DA5,
			desc: 'Sound library filename for Kenelm speech, part 3'
		}, {
			id: 'filename.sounds.alien.speech.kenelm4',
			type: stringz(8),
			offset: 0x31DB1,
			desc: 'Sound library filename for Kenelm speech, part 4'
		},

		{
			id: 'filename.sounds.extension',
			type: stringz(5),
			offset: 0x30C41,
			desc: 'Sound library filename extension'
		},

		{
			id: 'filename.table.cclass',
			type: stringz(11),
			offset: 0x34B46,
			desc: 'Communication Jammer Class Table filename'
		}, {
			id: 'filename.table.eclass',
			type: stringz(11),
			offset: 0x34BAA,
			desc: 'Engine Class Table filename'
		}, {
			id: 'filename.table.fact',
			type: stringz(9),
			offset: 0x31A74,
			desc: 'Fact Table filename'
		}, {
			id: 'filename.table.invent',
			type: stringz(11),
			offset: 0x32045,
			desc: 'Inventory Table filename'
		}, {
			id: 'filename.table.lbooster',
			type: stringz(13),
			offset: 0x34455,
			desc: 'Labor Botbooster Table filename'
		}, {
			id: 'filename.table.lclass',
			type: stringz(11),
			offset: 0x3444A,
			desc: 'Labor Bot Class Table filename'
		}, {
			id: 'filename.table.mclass',
			type: stringz(11),
			offset: 0x34BCB,
			desc: 'Missile Class Table filename'
		}, {
			id: 'filename.table.msys',
			type: stringz(9),
			offset: 0x34BD6,
			desc: 'Missile Loader Table filename'
		}, {
			id: 'filename.table.meta',
			type: stringz(9),
			offset: 0x32479,
			desc: 'Meta Table filename'
		}, {
			id: 'filename.table.metatxt',
			type: stringz(12),
			offset: 0x32482,
			desc: 'Meta Text Table filename'
		}, {
			id: 'filename.table.mission',
			type: stringz(12),
			offset: 0x32578,
			desc: 'Mission Table filename'
		}, {
			id: 'filename.table.object',
			type: stringz(11),
			offset: 0x31A24,
			desc: 'Object Table filename'
		}, {
			id: 'filename.table.pclass',
			type: stringz(11),
			offset: 0x31A58,
			desc: 'Place Class Table filename'
		}, {
			id: 'filename.table.place',
			type: stringz(10),
			offset: 0x31A42,
			desc: 'Place Table filename'
		}, {
			id: 'filename.table.rclass',
			type: stringz(11),
			offset: 0x34046,
			desc: 'Ship Botbooster Class Table filename'
		}, {
			id: 'filename.table.ship',
			type: stringz(9),
			offset: 0x34A1A,
			desc: 'Ship Table filename'
		}, {
			id: 'filename.table.scclass',
			type: stringz(12),
			offset: 0x34C0C,
			desc: 'Scanner Class Table filename'
		}, {
			id: 'filename.table.sclass',
			type: stringz(11),
			offset: 0x34A23,
			desc: 'Ship Class Table filename'
		}, {
			id: 'filename.table.shclass',
			type: stringz(12),
			offset: 0x34CA2,
			desc: 'Shield Class Table filename'
		}, {
			id: 'filename.table.stclass',
			type: stringz(12),
			offset: 0x31A4C,
			desc: 'Star Class Table filename'
		},

		{
			id: 'game.restart.chocolate',
			type: RecordType.int.u8,
			offset: 0x3EDF1,
			desc: 'Number of chocolate bars to receive when restarting after game over'
		},

		{
			id: 'menu.timelock.save-and-exit',
			type: stringz(19),
			offset: 0x3053A,
			desc: 'Menu entry text for Timelock / Save and Exit'
		}, {
			id: 'menu.timelock.save-and-return',
			type: stringz(24),
			offset: 0x3054D,
			desc: 'Menu entry text for Timelock / Save and Return'
		}, {
			id: 'menu.timelock.exit-only',
			type: stringz(10),
			offset: 0x30563,
			desc: 'Menu entry text for Timelock / Exit Only'
		}, {
			id: 'menu.timelock.return-to-game',
			type: stringz(15),
			offset: 0x3056D,
			desc: 'Menu entry text for Timelock / Return to Game'
		},

		{
			id: 'menu.gameover.rebuild',
			type: stringz(24),
			offset: 0x30581,
			desc: 'Menu entry text for Game Over / Rebuild'
		}, {
			id: 'menu.gameover.quit',
			type: stringz(5),
			offset: 0x30597,
			desc: 'Menu entry text for Game Over / Quit'
		},

		{
			id: 'menu.ship.track-next',
			type: stringz(16),
			offset: 0x305A0,
			desc: 'Menu entry text for ship tracking / Track Next Ship'
		}, {
			id: 'menu.ship.disregard',
			type: stringz(10),
			offset: 0x305B0,
			desc: 'Menu entry text for ship tracking / Disregard'
		},

		{
			id: 'menu.main.navigate',
			type: stringz(9),
			offset: 0x305BE,
			desc: 'Menu entry text for Main / Navigate'
		}, {
			id: 'menu.main.scan',
			type: stringz(5),
			offset: 0x305C7,
			desc: 'Menu entry text for Main / Scan'
		}, {
			id: 'menu.main.communicate',
			type: stringz(12),
			offset: 0x305CC,
			desc: 'Menu entry text for Main / Communicate'
		}, {
			id: 'menu.main.combat',
			type: stringz(8),
			offset: 0x305D8,
			desc: 'Menu entry text for Main / Combat'
		}, {
			id: 'menu.main.engineering',
			type: stringz(12),
			offset: 0x305E0,
			desc: 'Menu entry text for Main / Engineering'
		}, {
			id: 'menu.main.inventory',
			type: stringz(10),
			offset: 0x305EC,
			desc: 'Menu entry text for Main / Inventory'
		}, {
			id: 'menu.main.log',
			type: stringz(4),
			offset: 0x305F6,
			desc: 'Menu entry text for Main / Log'
		}, {
			id: 'menu.main.timelock',
			type: stringz(10),
			offset: 0x305FA,
			desc: 'Menu entry text for Main / Time Lock'
		},

		{
			id: 'menu.navigate.enter-gateway',
			type: stringz(15),
			offset: 0x3065B,
			desc: 'Menu entry text for Navigate / Enter Gateway'
		}, {
			id: 'menu.navigate.known-space',
			type: stringz(12),
			offset: 0x3066A,
			desc: 'Menu entry text for Navigate / Known Space'
		}, {
			id: 'menu.navigate.system-map',
			type: stringz(11),
			offset: 0x30676,
			desc: 'Menu entry text for Navigate / System Map'
		},

		{
			id: 'menu.navigate.losten.select-group',
			type: stringz(16),
			offset: 0x337F0,
			desc: 'Menu entry text for Navigate / Losten Gateway / Select Grouping'
		}, {
			id: 'menu.navigate.losten.pause',
			type: stringz(6),
			offset: 0x33800,
			desc: 'Menu entry text for Navigate / Losten Gateway / Pause'
		}, {
			id: 'menu.navigate.losten.quit',
			type: stringz(5),
			offset: 0x33806,
			desc: 'Menu entry text for Navigate / Losten Gateway / Quit'
		},

		{
			id: 'menu.scan.ship',
			type: stringz(10),
			offset: 0x30685,
			desc: 'Menu entry text for Scan / Ship Scan'
		}, {
			id: 'menu.scan.planet',
			type: stringz(12),
			offset: 0x3068F,
			desc: 'Menu entry text for Scan / Planet Scan'
		},

		{
			id: 'menu.communicate.altec',
			type: stringz(13),
			offset: 0x306A0,
			desc: 'Menu entry text for Communicate / Altec Hocker'
		}, {
			id: 'menu.communicate.failsafe',
			type: stringz(20),
			offset: 0x306AD,
			desc: 'Menu entry text for Communicate / Activate Fail-Safe'
		}, {
			id: 'menu.communicate.mayday',
			type: stringz(7),
			offset: 0x306C1,
			desc: 'Menu entry text for Communicate / Mayday'
		}, {
			id: 'menu.communicate.planet-rep',
			type: stringz(23),
			offset: 0x306C8,
			desc: 'Menu entry text for Communicate / Planet Representative'
		}, {
			id: 'menu.communicate.comnet',
			type: stringz(16),
			offset: 0x306DF,
			desc: 'Menu entry text for Communicate / Planet Com-Net'
		}, {
			id: 'menu.communicate.laborbot',
			type: stringz(10),
			offset: 0x306EF,
			desc: 'Menu entry text for Communicate / Labor Bot'
		},

		{
			id: 'menu.laborbot.send',
			type: stringz(16),
			offset: 0x307AB,
			desc: 'Menu entry text for Labor Bot / Send'
		}, {
			id: 'menu.laborbot.retrieve',
			type: stringz(15),
			offset: 0x307BB,
			desc: 'Menu entry text for Labor Bot / Retrieve'
		},

		{
			id: 'menu.engineering.status',
			type: stringz(7),
			offset: 0x307E0,
			desc: 'Menu entry text for Engineering / Status'
		}, {
			id: 'menu.engineering.repair',
			type: stringz(7),
			offset: 0x307E7,
			desc: 'Menu entry text for Engineering / Repair'
		},

		{
			id: 'menu.conversation.ask-about',
			type: stringz(14),
			offset: 0x31DB9,
			desc: 'Menu entry text for Conversation / Ask About'
		}, {
			id: 'menu.conversation.give-fact',
			type: stringz(20),
			offset: 0x31DC7,
			desc: 'Menu entry text for Conversation / Give Fact'
		}, {
			id: 'menu.conversation.display-object',
			type: stringz(19),
			offset: 0x31DDB,
			desc: 'Menu entry text for Conversation / Display Object'
		}, {
			id: 'menu.conversation.give-object',
			type: stringz(16),
			offset: 0x31DEE,
			desc: 'Menu entry text for Conversation / Give Object'
		}, {
			id: 'menu.conversation.trade',
			type: stringz(10),
			offset: 0x31DFE,
			desc: 'Menu entry text for Conversation / Trade'
		}, {
			id: 'menu.conversation.sign-off',
			type: stringz(9),
			offset: 0x31E08,
			desc: 'Menu entry text for Conversation / Sign Off'
		},

		{
			id: 'menu.conversation.topic.person',
			type: stringz(7),
			offset: 0x31E14,
			desc: 'Menu entry text for Conversation / Topic / Person'
		}, {
			id: 'menu.conversation.topic.location',
			type: stringz(9),
			offset: 0x31E1B,
			desc: 'Menu entry text for Conversation / Topic / Location'
		}, {
			id: 'menu.conversation.topic.object',
			type: stringz(7),
			offset: 0x31E24,
			desc: 'Menu entry text for Conversation / Topic / Object'
		}, {
			id: 'menu.conversation.topic.race',
			type: stringz(5),
			offset: 0x31E2B,
			desc: 'Menu entry text for Conversation / Topic / Race'
		},

		{
			id: 'menu.conversation.trade.ask-for',
			type: stringz(11),
			offset: 0x3237E,
			desc: 'Menu entry text for Conversation / Trade / Ask For'
		}, {
			id: 'menu.conversation.trade.offer',
			type: stringz(10),
			offset: 0x32389,
			desc: 'Menu entry text for Conversation / Trade / Offer'
		}, {
			id: 'menu.conversation.trade.end-trading',
			type: stringz(12),
			offset: 0x32392,
			desc: 'Menu entry text for Conversation / Trade / End Trading'
		},

		{
			id: 'status.combat.escape-pod',
			type: stringz(36),
			offset: 0x34AE9,
			desc: 'Status text for escape pod jettison'
		}, {
			id: 'status.combat.jammer',
			type: stringz(32),
			offset: 0x34B57,
			desc: 'Status text for activating jammer'
		}, {
			id: 'status.combat.scavenge',
			type: stringz(54),
			offset: 0x34AB3,
			desc: 'Status text for scavenging terminated ship\'s inventory'
		}, {
			id: 'status.comlink.no-response',
			type: stringz(29),
			offset: 0x307F2,
			desc: 'Status text for vessel not responding to hails'
		}, {
			id: 'status.comlink.terminated',
			type: stringz(20),
			offset: 0x3080F,
			desc: 'Status text for com-link termination'
		}, {
			id: 'status.engines.inop',
			type: stringz(33),
			offset: 0x33FF2,
			desc: 'Status text for inoperational engines'
		}, {
			id: 'status.failsafe.activated',
			type: stringz(58),
			offset: 0x30706,
			desc: 'Status text for failsafe activation and MCR destruction'
		}, {
			id: 'status.game.saved',
			type: stringz(17),
			offset: 0x3064A,
			desc: 'Status text for game saving success'
		}, {
			id: 'status.laborbot.cargo',
			type: stringz(27),
			offset: 0x344F8,
			desc: 'Status text for labor bot cargo report (with print formatters)'
		}, {
			id: 'status.laborbot.crash.land',
			type: stringz(56),
			offset: 0x3449B,
			desc: 'Status text for labor bot destroyed by crash landing'
		}, {
			id: 'status.laborbot.crash.water',
			type: stringz(49),
			offset: 0x3446A,
			desc: 'Status text for labor bot destroyed by water landing'
		}, {
			id: 'status.laborbot.landed',
			type: stringz(37),
			offset: 0x344D3,
			desc: 'Status text for labor bot successful landing'
		}, {
			id: 'status.laborbot.no-cargo',
			type: stringz(38),
			offset: 0x34513,
			desc: 'Status text for labor bot no-cargo report'
		}, {
			id: 'status.laborbot.no-labor-bots',
			type: stringz(24),
			offset: 0x30793,
			desc: 'Status text for insufficient labor bots'
		}, {
			id: 'status.laborbot.no-spy-bots',
			type: stringz(22),
			offset: 0x3077D,
			desc: 'Status text for insufficient spy bots'
		}, {
			id: 'status.laborbot.telemetry.destroyed',
			type: stringz(16),
			offset: 0x369C8,
			desc: 'Status text for labor bot telemetry, destroyed'
		}, {
			id: 'status.laborbot.telemetry.landed',
			type: stringz(18),
			offset: 0x369E4,
			desc: 'Status text for labor bot telemetry, landed'
		}, {
			id: 'status.laborbot.telemetry.splashdown',
			type: stringz(12),
			offset: 0x369D8,
			desc: 'Status text for labor bot telemetry, splashdown'
		}, {
			id: 'status.losten.closed',
			type: stringz(25),
			offset: 0x30764,
			desc: 'Status text for Losten gateway being closed'
		}, {
			id: 'status.mayday.broadcast',
			type: stringz(31),
			offset: 0x30745,
			desc: 'Status text for mayday broadcast'
		}, {
			id: 'status.mayday.response',
			type: stringz(50),
			offset: 0x34B77,
			desc: 'Status text for mayday response'
		}, {
			id: 'status.planet-view',
			type: stringz(29),
			offset: 0x32A38,
			desc: 'Status text for returning to the planet view'
		}, {
			id: 'status.repair.complete',
			type: stringz(23),
			offset: 0x3496F,
			desc: 'Status text for ship system repair completion'
		}, {
			id: 'status.repair.denied',
			type: stringz(37),
			offset: 0x3494A,
			desc: 'Status text for ship system repair denial (already at max capacity)'
		}, {
			id: 'status.repair.start',
			type: stringz(24),
			offset: 0x34932,
			desc: 'Status text for ship system repair start'
		}, {
			id: 'status.scanner.inop',
			type: stringz(26),
			offset: 0x30609,
			desc: 'Status text for inoperational scanner'
		}, {
			id: 'status.travel.engage-engines',
			type: stringz(22),
			offset: 0x32A1C,
			desc: 'Status text for engaging warp engines'
		}, {
			id: 'status.travel.establish-orbit',
			type: stringz(28),
			offset: 0x329CF,
			desc: 'Status text for establishing standard orbit'
		}, {
			id: 'status.travel.warp-to-safety',
			type: stringz(25),
			offset: 0x329F8,
			desc: 'Status text for warping to a safe planet'
		}, {
			id: 'status.weapon.inop',
			type: stringz(32),
			offset: 0x3062A,
			desc: 'Status text for inoperational weapons'
		},

		{
			id: 'status.gameover',
			type: stringz(10),
			offset: 0x30B3C,
			desc: 'Game Over message start'
		}, {
			id: 'status.gameover.destroyed',
			type: stringz(25),
			offset: 0x30B46,
			desc: 'Game Over message, player\'s ship destroyed'
		}, {
			id: 'status.gameover.wap',
			type: stringz(89),
			offset: 0x30B5F,
			desc: 'Game Over message, nonexistence of WAP revealed to Korok'
		}, {
			id: 'status.gameover.defeat',
			type: stringz(86),
			offset: 0x30BB8,
			desc: 'Game Over message, Korok defeats alliance'
		},
		];
	}
}