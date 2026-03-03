import type { Configuration } from 'electron-builder';

const config: Configuration = {
	appId: 'app.allornothing.game',
	productName: 'All or Nothing',
	directories: {
		output: 'dist/desktop',
	},
	files: [
		'dist/web/**/*',
		'dist/electron/**/*',
	],
	linux: {
		target: ['AppImage'],
		category: 'Game',
	},
	win: {
		target: ['zip'],
	},
	extraMetadata: {
		main: 'dist/electron/main.js',
	},
};

export default config;
