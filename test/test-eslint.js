import lint from 'mocha-eslint';

const paths = [
	'cli/*.js',
	'formats',
	'interface',
	'test',
	'util',
];

lint(paths);
